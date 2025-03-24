package org.example.finance_management_system.controller;

import org.example.finance_management_system.dto.request.SavingsAccountRequest;
import org.example.finance_management_system.dto.response.MessageResponse;
import org.example.finance_management_system.dto.response.SavingsAccountResponse;
import org.example.finance_management_system.dto.response.SavingsProjectionResponse;
import org.example.finance_management_system.exception.BadRequestException;
import org.example.finance_management_system.exception.ResourceNotFoundException;
import org.example.finance_management_system.model.Account;
import org.example.finance_management_system.model.SavingsAccount;
import org.example.finance_management_system.model.Transaction;
import org.example.finance_management_system.model.User;
import org.example.finance_management_system.repository.AccountRepository;
import org.example.finance_management_system.repository.SavingsAccountRepository;
import org.example.finance_management_system.repository.TransactionRepository;
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
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class SavingsAccountController {

    private static final Logger logger = LoggerFactory.getLogger(SavingsAccountController.class);

    @Autowired
    private SavingsAccountRepository savingsAccountRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping({"/savings", "/api/savings"})
    public ResponseEntity<?> getAllSavingsAccounts() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        List<SavingsAccount> savingsAccounts = savingsAccountRepository.findByUserId(userDetails.getId());

        List<SavingsAccountResponse> response = savingsAccounts.stream()
                .map(SavingsAccountResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping({"/savings/{id}", "/api/savings/{id}"})
    public ResponseEntity<?> getSavingsAccountById(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        SavingsAccount savingsAccount = savingsAccountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Savings Account", "id", id));

        // Check if savings account belongs to the authenticated user
        if (!savingsAccount.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("You don't have permission to view this savings account"));
        }

        return ResponseEntity.ok(SavingsAccountResponse.fromEntity(savingsAccount));
    }

    @PostMapping({"/savings", "/api/savings"})
    public ResponseEntity<?> createSavingsAccount(@Valid @RequestBody SavingsAccountRequest request) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();

            // Check if savings account name already exists for this user
            if (savingsAccountRepository.existsByNameAndUserId(request.getName(), userDetails.getId())) {
                throw new BadRequestException("Savings account with this name already exists");
            }

            // Get user
            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userDetails.getId()));

            // Get source account
            Account sourceAccount = accountRepository.findById(request.getSourceAccountId())
                    .orElseThrow(() -> new ResourceNotFoundException("Account", "id", request.getSourceAccountId()));

            // Check if account belongs to user
            if (!sourceAccount.getUser().getId().equals(userDetails.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("You don't have permission to use this account"));
            }

            // Check if source account has enough balance
            if (sourceAccount.getBalance().compareTo(request.getInitialDeposit()) < 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new MessageResponse("Insufficient funds in the source account"));
            }

            // Create new savings account
            SavingsAccount savingsAccount = new SavingsAccount();
            savingsAccount.setName(request.getName());
            savingsAccount.setInitialDeposit(request.getInitialDeposit());
            savingsAccount.setInterestRate(request.getInterestRate());
            savingsAccount.setTermType(request.getTermType());
            savingsAccount.setTag(request.getTag());
            savingsAccount.setSourceAccount(sourceAccount);
            savingsAccount.setStartDate(request.getStartDate());
            savingsAccount.setUser(user);
            savingsAccount.setStatus(SavingsAccount.SavingsStatus.ACTIVE);

            // Calculate maturity date based on term type
            LocalDate maturityDate;
            switch (request.getTermType()) {
                case THREE_MONTH:
                    maturityDate = request.getStartDate().plusMonths(3);
                    break;
                case SIX_MONTH:
                    maturityDate = request.getStartDate().plusMonths(6);
                    break;
                case TWELVE_MONTH:
                    maturityDate = request.getStartDate().plusYears(1);
                    break;
                case DAILY_FLEXIBLE:
                default:
                    // For daily flexible, set a default of 1 year, but it can be withdrawn anytime
                    maturityDate = request.getStartDate().plusYears(1);
                    break;
            }
            savingsAccount.setMaturityDate(maturityDate);

            // Update source account balance (deduct the initial deposit)
            sourceAccount.setBalance(sourceAccount.getBalance().subtract(request.getInitialDeposit()));
            accountRepository.save(sourceAccount);

            // Create a transaction for this deposit
            Transaction transaction = new Transaction();
            transaction.setAmount(request.getInitialDeposit());
            transaction.setType(Transaction.TransactionType.EXPENSE);
            transaction.setCategory(Transaction.Category.OTHER); // Changed to use OTHER instead of SAVINGS
            transaction.setDescription("Initial deposit for savings account: " + request.getName());
            transaction.setDate(LocalDateTime.now());
            transaction.setAccount(sourceAccount);
            transaction.setUser(user);
            transactionRepository.save(transaction);

            // Save the savings account
            savingsAccountRepository.save(savingsAccount);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(SavingsAccountResponse.fromEntity(savingsAccount));

        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Error creating savings account", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error creating savings account: " + e.getMessage()));
        }
    }

    @GetMapping({"/savings/{id}/projection", "/api/savings/{id}/projection"})
    public ResponseEntity<?> getSavingsProjection(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        SavingsAccount savingsAccount = savingsAccountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Savings Account", "id", id));

        // Check if savings account belongs to the authenticated user
        if (!savingsAccount.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("You don't have permission to view this savings account"));
        }

        // Calculate projection
        SavingsProjectionResponse projection = calculateProjection(savingsAccount);

        return ResponseEntity.ok(projection);
    }

    @PostMapping({"/savings/{id}/withdraw", "/api/savings/{id}/withdraw"})
    public ResponseEntity<?> withdrawSavings(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        SavingsAccount savingsAccount = savingsAccountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Savings Account", "id", id));

        // Check if savings account belongs to the authenticated user
        if (!savingsAccount.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("You don't have permission to withdraw from this savings account"));
        }

        // Check if already withdrawn
        if (savingsAccount.getStatus() == SavingsAccount.SavingsStatus.WITHDRAWN) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("This savings account has already been withdrawn"));
        }

        // Calculate current value
        SavingsAccountResponse savingsResponse = SavingsAccountResponse.fromEntity(savingsAccount);
        BigDecimal withdrawalAmount = savingsResponse.getCurrentValue();

        // Update source account balance (add back the withdrawal amount)
        Account sourceAccount = savingsAccount.getSourceAccount();
        sourceAccount.setBalance(sourceAccount.getBalance().add(withdrawalAmount));
        accountRepository.save(sourceAccount);

        // Create a transaction for this withdrawal
        Transaction transaction = new Transaction();
        transaction.setAmount(withdrawalAmount);
        transaction.setType(Transaction.TransactionType.INCOME);
        transaction.setCategory(Transaction.Category.OTHER); // Changed to use OTHER instead of SAVINGS
        transaction.setDescription("Withdrawal from savings account: " + savingsAccount.getName());
        transaction.setDate(LocalDateTime.now());
        transaction.setAccount(sourceAccount);
        transaction.setUser(savingsAccount.getUser());
        transactionRepository.save(transaction);

        // Update savings account status
        LocalDate today = LocalDate.now();
        savingsAccount.setStatus(SavingsAccount.SavingsStatus.WITHDRAWN);
        savingsAccount.setWithdrawalDate(today);
        savingsAccountRepository.save(savingsAccount);

        return ResponseEntity.ok(SavingsAccountResponse.fromEntity(savingsAccount));
    }

    private SavingsProjectionResponse calculateProjection(SavingsAccount savingsAccount) {
        SavingsProjectionResponse projection = new SavingsProjectionResponse();
        projection.setInitialDeposit(savingsAccount.getInitialDeposit());
        projection.setInterestRate(savingsAccount.getInterestRate());
        projection.setStartDate(savingsAccount.getStartDate());
        projection.setMaturityDate(savingsAccount.getMaturityDate());

        // Calculate daily interest rate (annual rate / 365)
        BigDecimal dailyRate = savingsAccount.getInterestRate()
                .divide(BigDecimal.valueOf(36500), 10, RoundingMode.HALF_UP);

        // Calculate daily interest amount
        BigDecimal dailyInterest = savingsAccount.getInitialDeposit()
                .multiply(dailyRate)
                .setScale(2, RoundingMode.HALF_UP);
        projection.setDailyInterest(dailyInterest);

        // Calculate monthly interest (approximate)
        BigDecimal monthlyInterest = dailyInterest.multiply(BigDecimal.valueOf(30))
                .setScale(2, RoundingMode.HALF_UP);
        projection.setMonthlyInterest(monthlyInterest);

        // Calculate yearly interest (approximate)
        BigDecimal yearlyInterest = dailyInterest.multiply(BigDecimal.valueOf(365))
                .setScale(2, RoundingMode.HALF_UP);
        projection.setYearlyInterest(yearlyInterest);

        // Calculate total days
        long totalDays = ChronoUnit.DAYS.between(savingsAccount.getStartDate(), savingsAccount.getMaturityDate());

        // Calculate total interest over the full term
        BigDecimal totalInterest = dailyInterest.multiply(BigDecimal.valueOf(totalDays))
                .setScale(2, RoundingMode.HALF_UP);
        projection.setTotalInterest(totalInterest);

        // Calculate final amount
        BigDecimal finalAmount = savingsAccount.getInitialDeposit().add(totalInterest);
        projection.setFinalAmount(finalAmount);

        // Create timeline entries (monthly intervals)
        List<SavingsProjectionResponse.ProjectionEntry> timeline = new ArrayList<>();
        LocalDate currentDate = savingsAccount.getStartDate();

        // Add initial entry
        timeline.add(new SavingsProjectionResponse.ProjectionEntry(
                currentDate,
                BigDecimal.ZERO,
                savingsAccount.getInitialDeposit()
        ));

        // Add monthly entries until maturity
        while (currentDate.isBefore(savingsAccount.getMaturityDate())) {
            LocalDate nextDate = currentDate.plusMonths(1);
            if (nextDate.isAfter(savingsAccount.getMaturityDate())) {
                nextDate = savingsAccount.getMaturityDate();
            }

            long daysBetween = ChronoUnit.DAYS.between(savingsAccount.getStartDate(), nextDate);
            BigDecimal interestToDate = dailyInterest.multiply(BigDecimal.valueOf(daysBetween))
                    .setScale(2, RoundingMode.HALF_UP);
            BigDecimal totalToDate = savingsAccount.getInitialDeposit().add(interestToDate);

            timeline.add(new SavingsProjectionResponse.ProjectionEntry(
                    nextDate,
                    interestToDate,
                    totalToDate
            ));

            currentDate = nextDate;
        }

        projection.setTimeline(timeline);
        return projection;
    }
}
