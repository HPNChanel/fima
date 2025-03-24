package org.example.finance_management_system.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.example.finance_management_system.dto.request.TransactionRequest;
import org.example.finance_management_system.dto.response.MessageResponse;
import org.example.finance_management_system.dto.response.TransactionHistoryResponse;
import org.example.finance_management_system.dto.response.TransactionResponse;
import org.example.finance_management_system.exception.ResourceNotFoundException;
import org.example.finance_management_system.model.Account;
import org.example.finance_management_system.model.Transaction;
import org.example.finance_management_system.model.TransactionHistory;
import org.example.finance_management_system.model.User;
import org.example.finance_management_system.repository.AccountRepository;
import org.example.finance_management_system.repository.TransactionHistoryRepository;
import org.example.finance_management_system.repository.TransactionRepository;
import org.example.finance_management_system.repository.UserRepository;
import org.example.finance_management_system.security.services.UserDetailsImpl;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

// Make sure this matches the path in the frontend service
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionHistoryRepository transactionHistoryRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private static final Logger logger = LoggerFactory.getLogger(TransactionController.class);

    // Get all transactions for current user
    @GetMapping({"/transactions", "/api/transactions"})
    public ResponseEntity<?> getAllTransactions() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        List<Transaction> transactions = transactionRepository.findByUserId(userDetails.getId());
        return ResponseEntity.ok(transactions.stream()
                .map(TransactionResponse::fromEntity)
                .collect(Collectors.toList()));
    }

    // Get transaction by ID
    @GetMapping({"/transactions/{id}", "/api/transactions/{id}"})
    public ResponseEntity<?> getTransactionById(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "id", id));

        // Check if transaction belongs to current user
        if(!transaction.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("You don't have permission to view this transaction"));
        }

        return ResponseEntity.ok(TransactionResponse.fromEntity(transaction));
    }

    // Update createTransaction method to handle account balance update
    @PostMapping({"/transactions", "/api/transactions"})
    public ResponseEntity<?> createTransaction(@Valid @RequestBody TransactionRequest request) {
        try {
            // Log the incoming request
            logger.debug("Received transaction creation request: {}", request);

            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();

            logger.debug("User details: {}", userDetails.getUsername());

            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userDetails.getId()));

            // Get the selected account
            Account account = accountRepository.findById(request.getAccountId())
                    .orElseThrow(() -> new ResourceNotFoundException("Account", "id", request.getAccountId()));

            // Verify account belongs to user
            if (!account.getUser().getId().equals(userDetails.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("You don't have permission to use this account"));
            }

            Transaction transaction = new Transaction();
            transaction.setDescription(request.getDescription());
            transaction.setAmount(request.getAmount());
            transaction.setType(request.getType());
            transaction.setCategory(request.getCategory());
            transaction.setDate(request.getDate() != null ? request.getDate() : LocalDateTime.now());
            transaction.setUser(user);
            transaction.setAccount(account);
            transaction.setNotes(request.getNotes());

            // Update account balance based on transaction type
            BigDecimal currentBalance = account.getBalance();
            if (transaction.getType() == Transaction.TransactionType.INCOME) {
                account.setBalance(currentBalance.add(transaction.getAmount()));
            } else if (transaction.getType() == Transaction.TransactionType.EXPENSE) {
                account.setBalance(currentBalance.subtract(transaction.getAmount()));
            }

            // Save both the transaction and updated account
            accountRepository.save(account);
            transactionRepository.save(transaction);

            return ResponseEntity.ok(TransactionResponse.fromEntity(transaction));
        } catch (Exception e) {
            logger.error("Error creating transaction", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error creating transaction: " + e.getMessage()));
        }
    }

    // Update updateTransaction method to handle account balance update
    @PutMapping({"/transactions/{id}", "/api/transactions/{id}"})
    public ResponseEntity<?> updateTransaction(
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest request) {

        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        try {
            Transaction transaction = transactionRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Transaction", "id", id));

            // Check if transaction belongs to current user
            if(!transaction.getUser().getId().equals(userDetails.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("You don't have permission to update this transaction"));
            }

            // Save the transaction state before updating
            String oldValueJson = objectMapper.writeValueAsString(
                    TransactionResponse.fromEntity(transaction));

            // Get original values before updating
            BigDecimal originalAmount = transaction.getAmount();
            Transaction.TransactionType originalType = transaction.getType();
            Account originalAccount = transaction.getAccount();

            // Get new account if it's different
            Account newAccount = originalAccount;
            if (!request.getAccountId().equals(originalAccount.getId())) {
                newAccount = accountRepository.findById(request.getAccountId())
                        .orElseThrow(() -> new ResourceNotFoundException("Account", "id", request.getAccountId()));

                // Verify new account belongs to user
                if (!newAccount.getUser().getId().equals(userDetails.getId())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(new MessageResponse("You don't have permission to use this account"));
                }
            }

            // Revert the effect of original transaction on the original account
            if (originalType == Transaction.TransactionType.INCOME) {
                originalAccount.setBalance(originalAccount.getBalance().subtract(originalAmount));
            } else if (originalType == Transaction.TransactionType.EXPENSE) {
                originalAccount.setBalance(originalAccount.getBalance().add(originalAmount));
            }

            // Save original account if it's different from new account
            if (!originalAccount.getId().equals(newAccount.getId())) {
                accountRepository.save(originalAccount);
            }

            // Update transaction with new values
            transaction.setDescription(request.getDescription());
            transaction.setAmount(request.getAmount());
            transaction.setType(request.getType());
            transaction.setCategory(request.getCategory());
            transaction.setDate(request.getDate());
            transaction.setAccount(newAccount);
            transaction.setNotes(request.getNotes());

            // Apply the effect of updated transaction on the new account
            if (request.getType() == Transaction.TransactionType.INCOME) {
                newAccount.setBalance(newAccount.getBalance().add(request.getAmount()));
            } else if (request.getType() == Transaction.TransactionType.EXPENSE) {
                newAccount.setBalance(newAccount.getBalance().subtract(request.getAmount()));
            }

            // Save both the account and transaction
            accountRepository.save(newAccount);
            transactionRepository.save(transaction);

            // Capture the new state after updating
            String newValueJson = objectMapper.writeValueAsString(
                    TransactionResponse.fromEntity(transaction));

            // Record the history if there were changes
            if (!oldValueJson.equals(newValueJson)) {
                TransactionHistory history = new TransactionHistory();
                history.setTransactionId(transaction.getId());
                history.setOldValue(oldValueJson);
                history.setNewValue(newValueJson);
                history.setChangedAt(LocalDateTime.now());
                history.setChangedBy(userDetails.getUsername());
                history.setChangeType(TransactionHistory.ChangeType.UPDATE.name());

                transactionHistoryRepository.save(history);
            }

            return ResponseEntity.ok(TransactionResponse.fromEntity(transaction));
        } catch (Exception e) {
            logger.error("Error updating transaction", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error updating transaction: " + e.getMessage()));
        }
    }

    // Update deleteTransaction method to handle account balance update
    @DeleteMapping({"/transactions/{id}", "/api/transactions/{id}"})
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        try {
            Transaction transaction = transactionRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Transaction", "id", id));

            // Check if transaction belongs to current user
            if(!transaction.getUser().getId().equals(userDetails.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("You don't have permission to delete this transaction"));
            }

            // Capture the transaction data before deletion
            String oldValueJson = objectMapper.writeValueAsString(
                    TransactionResponse.fromEntity(transaction));

            // Revert the effect of this transaction on the account balance
            Account account = transaction.getAccount();
            if (transaction.getType() == Transaction.TransactionType.INCOME) {
                account.setBalance(account.getBalance().subtract(transaction.getAmount()));
            } else if (transaction.getType() == Transaction.TransactionType.EXPENSE) {
                account.setBalance(account.getBalance().add(transaction.getAmount()));
            }

            // Save the account with updated balance
            accountRepository.save(account);

            // Create a new transaction history record
            TransactionHistory history = new TransactionHistory();
            history.setOldValue(oldValueJson);
            history.setNewValue(null);
            history.setChangedAt(LocalDateTime.now());
            history.setChangedBy(userDetails.getUsername());
            history.setChangeType(TransactionHistory.ChangeType.DELETE.name());

            // Set transaction ID to null for deleted transactions
            // This avoids the foreign key constraint issue
            history.setTransactionId(null);

            // Save the history record FIRST (with null transaction ID)
            TransactionHistory savedHistory = transactionHistoryRepository.save(history);

            // Then delete the transaction
            transactionRepository.delete(transaction);

            logger.info("Transaction with ID {} was successfully deleted", id);

            return ResponseEntity.ok(new MessageResponse("Transaction deleted successfully"));
        } catch (Exception e) {
            logger.error("Error deleting transaction: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error deleting transaction: " + e.getMessage()));
        }
    }

    // Add endpoint to update transaction notes
    @PutMapping({"/transactions/{id}/notes", "/api/transactions/{id}/notes"})
    public ResponseEntity<?> updateTransactionNotes(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Transaction transaction = transactionRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Transaction", "id", id));

            // Check if transaction belongs to authenticated user
            if(!transaction.getUser().getId().equals(userDetails.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("You don't have permission to update this transaction"));
            }

            // Update only the notes field
            transaction.setNotes(payload.get("notes"));
            transactionRepository.save(transaction);

            return ResponseEntity.ok(TransactionResponse.fromEntity(transaction));
        } catch (Exception e) {
            logger.error("Error updating transaction notes", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error updating transaction notes: " + e.getMessage()));
        }
    }

    // Add a new endpoint to get transaction history
    @GetMapping({"/transactions/{id}/history", "/api/transactions/{id}/history"})
    public ResponseEntity<?> getTransactionHistory(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        // Verify the transaction exists and belongs to the current user
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "id", id));

        if(!transaction.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("You don't have permission to view this transaction's history"));
        }

        // Get all history records for this transaction
        List<TransactionHistory> historyList = transactionHistoryRepository
                .findByTransactionIdOrderByChangedAtDesc(id);

        List<TransactionHistoryResponse> responseList = historyList.stream()
                .map(TransactionHistoryResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseList);
    }

    // Check if a transaction has history
    @GetMapping({"/transactions/{id}/has-history", "/api/transactions/{id}/has-history"})
    public ResponseEntity<?> hasTransactionHistory(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        // Verify the transaction exists and belongs to the current user
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "id", id));

        if(!transaction.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("You don't have permission to access this transaction"));
        }

        boolean hasHistory = transactionHistoryRepository.existsByTransactionId(id);

        return ResponseEntity.ok(Map.of("hasHistory", hasHistory));
    }

    // Add endpoint to get transactions for the calendar view
    @GetMapping({"/transactions/calendar", "/api/transactions/calendar"})
    public ResponseEntity<?> getTransactionsForCalendar(@RequestParam(name = "month", required = false) String monthStr) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();

            LocalDate startDate;
            LocalDate endDate;

            if (monthStr != null && !monthStr.isEmpty()) {
                try {
                    // Parse month parameter (format: yyyy-MM)
                    YearMonth yearMonth = YearMonth.parse(monthStr);
                    startDate = yearMonth.atDay(1);
                    endDate = yearMonth.atEndOfMonth();

                    logger.debug("Using requested month: {}, start: {}, end: {}",
                            monthStr, startDate, endDate);
                } catch (Exception e) {
                    // If parsing fails, fall back to current month
                    logger.warn("Failed to parse month '{}', falling back to current month", monthStr);
                    YearMonth currentMonth = YearMonth.now();
                    startDate = currentMonth.atDay(1);
                    endDate = currentMonth.atEndOfMonth();
                }
            } else {
                // Default to current month if not specified
                YearMonth currentMonth = YearMonth.now();
                startDate = currentMonth.atDay(1);
                endDate = currentMonth.atEndOfMonth();
            }

            // Convert to LocalDateTime for repository query
            LocalDateTime startDateTime = startDate.atStartOfDay();
            LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

            logger.debug("Fetching calendar transactions from {} to {}", startDateTime, endDateTime);
            List<Transaction> transactions = transactionRepository.findByUserIdAndDateBetween(
                    userDetails.getId(), startDateTime, endDateTime);

            return ResponseEntity.ok(transactions.stream()
                    .map(TransactionResponse::fromEntity)
                    .collect(Collectors.toList()));
        } catch (Exception e) {
            logger.error("Error fetching calendar transactions", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error fetching calendar transactions: " + e.getMessage()));
        }
    }

    // Add a new class to represent the batch delete request
    @PostMapping({"/transactions/batch-delete", "/api/transactions/batch-delete"})
    public ResponseEntity<?> batchDeleteTransactions(@RequestBody Map<String, List<Long>> request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        try {
            List<Long> ids = request.get("ids");

            if (ids == null || ids.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("No transaction IDs provided for deletion"));
            }

            logger.info("Batch delete request received for {} transactions: {}", ids.size(), ids);

            int successCount = 0;
            List<Long> failedIds = new ArrayList<>();
            List<String> errors = new ArrayList<>();

            // Process each transaction ID
            for (Long id : ids) {
                try {
                    // Find the transaction
                    Transaction transaction = transactionRepository.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("Transaction", "id", id));

                    // Check if transaction belongs to current user
                    if (!transaction.getUser().getId().equals(userDetails.getId())) {
                        failedIds.add(id);
                        errors.add("Transaction " + id + ": Permission denied");
                        continue;
                    }

                    // Capture the transaction data before deletion
                    String oldValueJson = objectMapper.writeValueAsString(
                            TransactionResponse.fromEntity(transaction));

                    // Revert the effect of this transaction on the account balance
                    Account account = transaction.getAccount();
                    if (transaction.getType() == Transaction.TransactionType.INCOME) {
                        account.setBalance(account.getBalance().subtract(transaction.getAmount()));
                    } else if (transaction.getType() == Transaction.TransactionType.EXPENSE) {
                        account.setBalance(account.getBalance().add(transaction.getAmount()));
                    }

                    // Save the account with updated balance
                    accountRepository.save(account);

                    // Create a new transaction history record
                    TransactionHistory history = new TransactionHistory();
                    history.setOldValue(oldValueJson);
                    history.setNewValue(null);
                    history.setChangedAt(LocalDateTime.now());
                    history.setChangedBy(userDetails.getUsername());
                    history.setChangeType(TransactionHistory.ChangeType.DELETE.name());

                    // Set transaction ID to null for deleted transactions
                    history.setTransactionId(null);

                    // Save the history record FIRST (with null transaction ID)
                    transactionHistoryRepository.save(history);

                    // Then delete the transaction

                    transactionRepository.delete(transaction);

                    // Increment success counter
                    successCount++;

                } catch (Exception e) {
                    logger.error("Error deleting transaction ID {}: {}", id, e.getMessage());
                    failedIds.add(id);
                    errors.add("Transaction " + id + ": " + e.getMessage());
                }
            }

            // Build appropriate response based on results
            if (failedIds.isEmpty()) {
                // All transactions deleted successfully
                return ResponseEntity.ok(new MessageResponse(
                        "Successfully deleted " + successCount + " transactions"));
            } else if (successCount > 0) {
                // Some transactions deleted, some failed
                return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                        .body(Map.of(
                                "message", "Partially completed. " + successCount + " deleted, " + failedIds.size() + " failed",
                                "failedIds", failedIds,
                                "errors", errors
                        ));
            } else {
                // All transactions failed to delete
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of(
                                "message", "Failed to delete any transactions",
                                "failedIds", failedIds,
                                "errors", errors
                        ));
            }
        } catch (Exception e) {
            logger.error("Error processing batch delete request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error processing batch delete: " + e.getMessage()));
        }
    }
}
