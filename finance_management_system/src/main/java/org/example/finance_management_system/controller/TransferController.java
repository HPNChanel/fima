package org.example.finance_management_system.controller;

import org.example.finance_management_system.dto.request.TransferRequest;
import org.example.finance_management_system.dto.response.MessageResponse;
import org.example.finance_management_system.dto.response.TransferResponse;
import org.example.finance_management_system.exception.ResourceNotFoundException;
import org.example.finance_management_system.model.Account;
import org.example.finance_management_system.model.Transfer;
import org.example.finance_management_system.model.User;
import org.example.finance_management_system.repository.AccountRepository;
import org.example.finance_management_system.repository.TransferRepository;
import org.example.finance_management_system.repository.UserRepository;
import org.example.finance_management_system.security.services.UserDetailsImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class TransferController {

    @Autowired
    private TransferRepository transferRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(TransferController.class);

    @GetMapping({"/transfers", "/api/transfers"})
    public ResponseEntity<?> getAllTransfers() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<Transfer> transfers = transferRepository.findByUserIdOrderByDateDesc(userDetails.getId());
        List<TransferResponse> transferResponses = transfers.stream()
                .map(TransferResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(transferResponses);
    }

    @GetMapping({"/transfers/{id}", "/api/transfers/{id}"})
    public ResponseEntity<?> getTransferById(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Transfer transfer = transferRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transfer", "id", id));

        // Verify the transfer belongs to the current user
        if (!transfer.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("You don't have permission to view this transfer"));
        }

        return ResponseEntity.ok(TransferResponse.fromEntity(transfer));
    }

    @PostMapping({"/transfers", "/api/transfers"})
    public ResponseEntity<?> createTransfer(@Valid @RequestBody TransferRequest request) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userDetails.getId()));

            // Update method calls to use the correct method names
            // Get source account
            Account sourceAccount = accountRepository.findById(request.getFromAccountId())
                    .orElseThrow(() -> new ResourceNotFoundException("Account", "id", request.getFromAccountId()));

            // Get destination account
            Account destinationAccount = accountRepository.findById(request.getToAccountId())
                    .orElseThrow(() -> new ResourceNotFoundException("Account", "id", request.getToAccountId()));

            // Verify both accounts belong to the user
            if (!sourceAccount.getUser().getId().equals(userDetails.getId()) ||
                    !destinationAccount.getUser().getId().equals(userDetails.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("You don't have permission to use these accounts"));
            }

            // Verify source account has sufficient funds
            if (sourceAccount.getBalance().compareTo(request.getAmount()) < 0) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Insufficient funds in source account"));
            }

            // Verify amount is positive
            if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Transfer amount must be positive"));
            }

            // Create transfer record
            Transfer transfer = new Transfer();
            transfer.setSourceAccount(sourceAccount);
            transfer.setDestinationAccount(destinationAccount);
            transfer.setAmount(request.getAmount());
            transfer.setDescription(request.getDescription());
            transfer.setDate(LocalDateTime.now());
            transfer.setUser(user);

            // Update account balances
            sourceAccount.setBalance(sourceAccount.getBalance().subtract(request.getAmount()));
            destinationAccount.setBalance(destinationAccount.getBalance().add(request.getAmount()));

            // Save all entities
            accountRepository.save(sourceAccount);
            accountRepository.save(destinationAccount);
            transferRepository.save(transfer);

            return ResponseEntity.ok(TransferResponse.fromEntity(transfer));
        } catch (Exception e) {
            logger.error("Error creating transfer", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error creating transfer: " + e.getMessage()));
        }
    }

    // Add this endpoint to get transfers by account ID
    @GetMapping({"/transfers/by-account/{accountId}", "/api/transfers/by-account/{accountId}"})
    public ResponseEntity<?> getTransfersByAccount(@PathVariable Long accountId) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // Verify the account belongs to the current user
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "id", accountId));

        if (!account.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("You don't have permission to view transfers for this account"));
        }

        // Fix: Use the correct parameter order for this method
        List<Transfer> transfers = transferRepository.findBySourceAccountIdOrDestinationAccountId(accountId);
        List<TransferResponse> transferResponses = transfers.stream()
                .map(TransferResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(transferResponses);
    }
}
