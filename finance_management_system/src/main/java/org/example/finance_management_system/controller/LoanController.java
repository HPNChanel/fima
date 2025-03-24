package org.example.finance_management_system.controller;

import org.example.finance_management_system.dto.request.LoanAccountRequest;
import org.example.finance_management_system.dto.response.LoanAccountResponse;
import org.example.finance_management_system.dto.response.MessageResponse;
import org.example.finance_management_system.exception.BadRequestException;
import org.example.finance_management_system.exception.ResourceNotFoundException;
import org.example.finance_management_system.model.LoanAccount;
import org.example.finance_management_system.repository.LoanAccountRepository;
import org.example.finance_management_system.security.services.UserDetailsImpl;
import org.example.finance_management_system.service.LoanService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class LoanController {

    private static final Logger logger = LoggerFactory.getLogger(LoanController.class);

    @Autowired
    private LoanAccountRepository loanAccountRepository;

    @Autowired
    private LoanService loanService;

    @GetMapping({"/loans", "/api/loans"})
    public ResponseEntity<?> getAllLoans() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        List<LoanAccount> loanAccounts = loanAccountRepository.findByUserId(userDetails.getId());

        List<LoanAccountResponse> response = loanAccounts.stream()
                .map(LoanAccountResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping({"/loans/{id}", "/api/loans/{id}"})
    public ResponseEntity<?> getLoanById(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        LoanAccount loanAccount = loanAccountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan Account", "id", id));

        // Check if loan account belongs to the authenticated user
        if (!loanAccount.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("You don't have permission to view this loan account"));
        }

        return ResponseEntity.ok(LoanAccountResponse.fromEntity(loanAccount));
    }

    @PostMapping({"/loans", "/api/loans"})
    public ResponseEntity<?> createLoan(@Valid @RequestBody LoanAccountRequest request) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();

            LoanAccount loanAccount = loanService.createLoan(request, userDetails.getId());

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(LoanAccountResponse.fromEntity(loanAccount));
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Error creating loan account", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error creating loan account: " + e.getMessage()));
        }
    }

    @PostMapping({"/loans/{id}/pay/{installmentNumber}", "/api/loans/{id}/pay/{installmentNumber}"})
    public ResponseEntity<?> makePayment(@PathVariable Long id, @PathVariable Integer installmentNumber) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();

            LoanAccount loanAccount = loanService.makePayment(id, installmentNumber, userDetails.getId());

            return ResponseEntity.ok(LoanAccountResponse.fromEntity(loanAccount));
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse(e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Error making loan payment", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error making loan payment: " + e.getMessage()));
        }
    }
}
