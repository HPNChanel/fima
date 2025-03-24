package org.example.finance_management_system.controller;

import jakarta.validation.Valid;
import org.example.finance_management_system.dto.request.AccountRequest;
import org.example.finance_management_system.dto.request.TransferRequest;
import org.example.finance_management_system.dto.response.AccountResponse;
import org.example.finance_management_system.dto.response.MessageResponse;
import org.example.finance_management_system.dto.response.TransactionResponse;
import org.example.finance_management_system.dto.response.TransferResponse;
import org.example.finance_management_system.exception.BadRequestException;
import org.example.finance_management_system.exception.ResourceNotFoundException;
import org.example.finance_management_system.model.Account;
import org.example.finance_management_system.model.Transaction;
import org.example.finance_management_system.model.Transfer;
import org.example.finance_management_system.model.User;
import org.example.finance_management_system.repository.AccountRepository;
import org.example.finance_management_system.repository.TransactionRepository;
import org.example.finance_management_system.repository.TransferRepository;
import org.example.finance_management_system.repository.UserRepository;
import org.example.finance_management_system.security.services.UserDetailsImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class AccountController {
    private static final Logger logger = LoggerFactory.getLogger(AccountController.class);

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private TransferRepository transferRepository;

    @GetMapping({"/accounts", "/api/accounts"})
    public ResponseEntity<?> getAllAccounts() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        List<Account> accounts = accountRepository.findByUserId(userDetails.getId());
        List<AccountResponse> responseList = accounts.stream()
                .map(AccountResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }

    @GetMapping({"/accounts/{id}", "/api/accounts/{id}"})
    public ResponseEntity<?> getAccountById(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "id", id));

        // Check if account belongs to the authenticated user
        if (!account.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("You don't have permission to access this account"));
        }
        return ResponseEntity.ok(AccountResponse.fromEntity(account));
    }

    @PostMapping({"/accounts", "/api/accounts"})
    public ResponseEntity<?> createAccount(@Valid @RequestBody AccountRequest request) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();

            // Check if account name already exists for this user
            if (accountRepository.existsByNameAndUserId(request.getName(), userDetails.getId())) {
                throw new BadRequestException("Account with this name already exists");
            }

            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userDetails.getId()));

            Account account = new Account();
            account.setName(request.getName());
            account.setType(request.getType());
            account.setBalance(request.getBalance());
            account.setAccountNumber(request.getAccountNumber());
            account.setDescription(request.getDescription());
            account.setUser(user);
            accountRepository.save(account);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(AccountResponse.fromEntity(account));

        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Error creating account", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error creating account: " + e.getMessage()));
        }
    }

    @PutMapping({"/accounts/{id}", "/api/accounts/{id}"})
    public ResponseEntity<?> updateAccount(@PathVariable Long id,
                                           @Valid @RequestBody AccountRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "id", id));

        // Check if account belongs to the authenticated user
        if (!account.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("You don't have permission to update this account"));
        }

        // Update account details
        account.setName(request.getName());
        account.setType(request.getType());
        account.setBalance(request.getBalance());
        account.setAccountNumber(request.getAccountNumber());
        account.setDescription(request.getDescription());
        accountRepository.save(account);
        return ResponseEntity.ok(AccountResponse.fromEntity(account));
    }

    @DeleteMapping({"/accounts/{id}", "/api/accounts/{id}"})
    public ResponseEntity<?> deleteAccount(@PathVariable Long id) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();

            Account account = accountRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Account", "id", id));

            // Check if account belongs to the authenticated user
            if (!account.getUser().getId().equals(userDetails.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("You don't have permission to delete this account"));
            }

            // Check if account has any transactions - use the repository method
            List<Transaction> transactions = transactionRepository.findByAccount(account);
            logger.debug("Found {} transactions for account {}", transactions.size(), id);

            if (!transactions.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new MessageResponse("Cannot delete account that has transactions. Please delete all transactions first or transfer them to another account."));
            }

            // Also check for any transfers involving this account
            List<Transfer> transfers = transferRepository.findBySourceAccountOrDestinationAccount(account, account);
            logger.debug("Found {} transfers for account {}", transfers.size(), id);

            if (!transfers.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new MessageResponse("Cannot delete account that has transfers. Please delete all transfers first."));
            }

            accountRepository.delete(account);
            return ResponseEntity.ok(new MessageResponse("Account deleted successfully"));
        } catch (DataIntegrityViolationException e) {
            logger.error("Foreign key constraint violation when deleting account", e);
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new MessageResponse("This account cannot be deleted because it has associated transactions or other data. Please remove these first."));
        } catch (Exception e) {
            logger.error("Error deleting account", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error deleting account: " + e.getMessage()));
        }
    }

    @GetMapping({"/accounts/types", "/api/accounts/types"})
    public ResponseEntity<?> getAccountTypes() {
        return ResponseEntity.ok(Account.AccountType.values());
    }

    // Add these endpoints to support account details page
    @GetMapping({"/accounts/{id}/transactions", "/api/accounts/{id}/transactions"})
    public ResponseEntity<?> getAccountTransactions(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        // Verify account exists and belongs to current user
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "id", id));
        if (!account.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("You don't have permission to access this account"));
        }

        // Get transactions for this account using the correct method
        List<Transaction> transactions = transactionRepository.findByAccount(account);
        return ResponseEntity.ok(transactions.stream()
                .map(TransactionResponse::fromEntity)
                .collect(Collectors.toList()));
    }

    @GetMapping({"/accounts/{id}/category-summary", "/api/accounts/{id}/category-summary"})
    public ResponseEntity<?> getAccountCategorySummary(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        // Verify account exists and belongs to current user
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "id", id));
        if (!account.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("You don't have permission to access this account"));
        }

        // Implementation would depend on your data structure
        // This is a placeholder
        return ResponseEntity.ok(new MessageResponse("Category summary not implemented yet"));
    }

    @GetMapping({"/accounts/{id}/transfers", "/api/accounts/{id}/transfers"})
    public ResponseEntity<?> getAccountTransfers(@PathVariable Long id) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();

            // Verify account exists and belongs to current user
            Account account = accountRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Account", "id", id));
            if (!account.getUser().getId().equals(userDetails.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("You don't have permission to access this account"));
            }

            List<Transfer> transfers = transferRepository.findAll().stream()
                    .filter(transfer ->
                            transfer.getSourceAccount().getId().equals(id) ||
                                    transfer.getDestinationAccount().getId().equals(id))
                    .sorted((t1, t2) -> t2.getDate().compareTo(t1.getDate())) // Sort by date, newest first
                    .collect(Collectors.toList());

            logger.debug("Found {} transfers for account {}", transfers.size(), id);

            // Convert to TransferResponse DTOs to avoid serialization issues
            List<TransferResponse> transferResponses = transfers.stream()
                    .map(TransferResponse::fromEntity)
                    .collect(Collectors.toList());

            // Return the transfer responses
            return ResponseEntity.ok(transferResponses);
        } catch (Exception e) {
            logger.error("Error fetching transfers for account {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error fetching transfer history: " + e.getMessage()));
        }
    }

    @GetMapping({"/accounts/total-balance", "/api/accounts/total-balance"})
    public ResponseEntity<?> getTotalBalance() {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();
            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userDetails.getId()));
            BigDecimal totalBalance = accountRepository.findByUserId(userDetails.getId()).stream()
                    .map(Account::getBalance)
                    .reduce(BigDecimal.ZERO, (subtotal, element) -> subtotal.add(element));
            Map<String, Object> response = new HashMap<>();
            response.put("totalBalance", totalBalance);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching total balance", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error fetching total balance: " + e.getMessage()));
        }
    }

    @PostMapping({"/accounts/transfer", "/api/accounts/transfer"})
    public ResponseEntity<?> transferBetweenAccounts(@Valid @RequestBody TransferRequest request) {
        logger.info("Received transfer request: {}", request);
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();

            // Find source account
            Account fromAccount = accountRepository.findById(request.getFromAccountId())
                    .orElseThrow(() -> new ResourceNotFoundException("Source Account", "id", request.getFromAccountId()));
            logger.debug("Source account found: {}", fromAccount.getName());

            // Find destination account
            Account toAccount = accountRepository.findById(request.getToAccountId())
                    .orElseThrow(() -> new ResourceNotFoundException("Destination Account", "id", request.getToAccountId()));

            // Check permissions and validate amounts
            if (!fromAccount.getUser().getId().equals(userDetails.getId()) ||
                    !toAccount.getUser().getId().equals(userDetails.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("You don't have permission to access these accounts"));
            }

            if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new MessageResponse("Transfer amount must be greater than zero"));
            }

            if (fromAccount.getBalance().compareTo(request.getAmount()) < 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new MessageResponse("Insufficient funds in source account"));
            }

            // Perform the transfer - update account balances
            fromAccount.setBalance(fromAccount.getBalance().subtract(request.getAmount()));
            toAccount.setBalance(toAccount.getBalance().add(request.getAmount()));

            // Save account changes
            accountRepository.save(fromAccount);
            accountRepository.save(toAccount);

            // Create and save transfer record
            Transfer transfer = new Transfer();
            transfer.setSourceAccount(fromAccount);
            transfer.setDestinationAccount(toAccount);
            transfer.setAmount(request.getAmount());
            transfer.setDescription(request.getDescription());
            transfer.setDate(LocalDateTime.now());
            transfer.setUser(fromAccount.getUser());

            transferRepository.save(transfer);

            // Create transaction records using only INCOME and EXPENSE types
            Transaction outgoingTransaction = new Transaction();
            outgoingTransaction.setAmount(request.getAmount());
            outgoingTransaction.setType(Transaction.TransactionType.EXPENSE);
            outgoingTransaction.setDescription(request.getDescription() + " (Transfer to " + toAccount.getName() + ")");
            outgoingTransaction.setAccount(fromAccount);
            outgoingTransaction.setCategory(Transaction.Category.TRANSFER);
            outgoingTransaction.setDate(LocalDateTime.now());
            outgoingTransaction.setUser(fromAccount.getUser());
            outgoingTransaction.setNotes("");

            Transaction incomingTransaction = new Transaction();
            incomingTransaction.setAmount(request.getAmount());
            incomingTransaction.setType(Transaction.TransactionType.INCOME);
            incomingTransaction.setDescription(request.getDescription() + " (Transfer from " + fromAccount.getName() + ")");
            incomingTransaction.setAccount(toAccount);
            incomingTransaction.setCategory(Transaction.Category.TRANSFER);
            incomingTransaction.setDate(LocalDateTime.now());
            incomingTransaction.setUser(toAccount.getUser());
            incomingTransaction.setNotes("");

            transactionRepository.save(outgoingTransaction);
            transactionRepository.save(incomingTransaction);

            return ResponseEntity.ok(new MessageResponse("Transfer completed successfully"));
        } catch (Exception e) {
            logger.error("Error processing transfer", e);
            String errorMessage = e.getMessage();
            if (e.getCause() != null) {
                errorMessage += " - Caused by: " + e.getCause().getMessage();
            }
            logger.error("Stack trace:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error processing transfer: " + errorMessage));
        }
    }

    @GetMapping({"/transactions/categories", "/api/transactions/categories"})
    public ResponseEntity<?> getTransactionCategories() {
        Transaction.Category[] categories = Transaction.Category.values();
        for (Transaction.Category category : categories) {
            logger.info("Available category: " + category.name());
        }
        return ResponseEntity.ok(categories);
    }
}
