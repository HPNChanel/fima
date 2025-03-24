package org.example.finance_management_system.service;

import org.example.finance_management_system.dto.request.LoanAccountRequest;
import org.example.finance_management_system.exception.BadRequestException;
import org.example.finance_management_system.exception.ResourceNotFoundException;
import org.example.finance_management_system.model.*;
import org.example.finance_management_system.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class LoanService {

    private static final Logger logger = LoggerFactory.getLogger(LoanService.class);

    @Autowired
    private LoanAccountRepository loanAccountRepository;

    @Autowired
    private LoanPaymentRepository loanPaymentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Transactional
    public LoanAccount createLoan(LoanAccountRequest request, Long userId) {
        // Validate if loan name already exists for this user
        if (loanAccountRepository.existsByNameAndUserId(request.getName(), userId)) {
            throw new BadRequestException("Loan account with this name already exists");
        }

        // Get user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Get destination account
        Account destinationAccount = accountRepository.findById(request.getDestinationAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Account", "id", request.getDestinationAccountId()));

        // Check if account belongs to user
        if (!destinationAccount.getUser().getId().equals(userId)) {
            throw new BadRequestException("You don't have permission to use this account");
        }

        // Create loan account
        LoanAccount loanAccount = new LoanAccount();
        loanAccount.setName(request.getName());
        loanAccount.setAmount(request.getAmount());
        loanAccount.setInterestRate(request.getInterestRate());
        loanAccount.setDurationMonths(request.getDurationMonths());
        loanAccount.setStartDate(request.getStartDate());
        loanAccount.setEndDate(request.getStartDate().plusMonths(request.getDurationMonths()));
        loanAccount.setStatus(LoanAccount.LoanStatus.ACTIVE);
        loanAccount.setUser(user);
        loanAccount.setDestinationAccount(destinationAccount);

        // Save loan account
        loanAccount = loanAccountRepository.save(loanAccount);

        // Generate payment schedule
        List<LoanPayment> paymentSchedule = generatePaymentSchedule(loanAccount);
        loanAccount.setPayments(paymentSchedule);
        loanAccountRepository.save(loanAccount);

        // Update destination account balance (add the loan amount)
        destinationAccount.setBalance(destinationAccount.getBalance().add(request.getAmount()));
        accountRepository.save(destinationAccount);

        // Create a transaction for this loan
        Transaction transaction = new Transaction();
        transaction.setAmount(request.getAmount());
        transaction.setType(Transaction.TransactionType.INCOME);
        transaction.setCategory(Transaction.Category.OTHER);
        transaction.setDescription("Loan disbursement: " + request.getName());
        transaction.setDate(LocalDateTime.now());
        transaction.setAccount(destinationAccount);
        transaction.setUser(user);
        transactionRepository.save(transaction);

        return loanAccount;
    }

    @Transactional
    public LoanAccount makePayment(Long loanId, Integer installmentNumber, Long userId) {
        // Get loan account
        LoanAccount loanAccount = loanAccountRepository.findById(loanId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan Account", "id", loanId));

        // Check if loan belongs to user
        if (!loanAccount.getUser().getId().equals(userId)) {
            throw new BadRequestException("You don't have permission to access this loan");
        }

        // Get the specific installment
        LoanPayment payment = loanPaymentRepository.findByLoanAccountIdAndInstallmentNumber(loanId, installmentNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "installment number", installmentNumber));

        // Check if payment is already paid
        if (payment.getStatus() == LoanPayment.PaymentStatus.PAID) {
            throw new BadRequestException("This installment has already been paid");
        }

        // Get source account
        Account sourceAccount = loanAccount.getDestinationAccount();

        // Check if account has sufficient balance
        if (sourceAccount.getBalance().compareTo(payment.getAmount()) < 0) {
            throw new BadRequestException("Insufficient funds in the account");
        }

        // Update payment status
        payment.setStatus(LoanPayment.PaymentStatus.PAID);
        payment.setPaymentDate(LocalDate.now());
        loanPaymentRepository.save(payment);

        // Update source account balance
        sourceAccount.setBalance(sourceAccount.getBalance().subtract(payment.getAmount()));
        accountRepository.save(sourceAccount);

        // Create a transaction for this payment
        Transaction transaction = new Transaction();
        transaction.setAmount(payment.getAmount());
        transaction.setType(Transaction.TransactionType.EXPENSE);
        transaction.setCategory(Transaction.Category.OTHER);
        transaction.setDescription("Loan payment #" + installmentNumber + " for " + loanAccount.getName());
        transaction.setDate(LocalDateTime.now());
        transaction.setAccount(sourceAccount);
        transaction.setUser(loanAccount.getUser());
        transactionRepository.save(transaction);

        // Check if all installments are paid
        boolean allPaid = loanAccount.getPayments().stream()
                .allMatch(p -> p.getStatus() == LoanPayment.PaymentStatus.PAID);

        if (allPaid) {
            loanAccount.setStatus(LoanAccount.LoanStatus.COMPLETED);
            loanAccountRepository.save(loanAccount);
        }

        return loanAccount;
    }

    private List<LoanPayment> generatePaymentSchedule(LoanAccount loanAccount) {
        List<LoanPayment> payments = new ArrayList<>();

        // Calculate monthly payment using the formula:
        // P = (r * PV) / (1 - (1 + r)^-n)
        // where:
        // P = monthly payment
        // PV = loan amount (present value)
        // r = monthly interest rate (annual rate / 12 / 100)
        // n = number of payments (duration in months)
        BigDecimal principal = loanAccount.getAmount();
        BigDecimal monthlyRate = loanAccount.getInterestRate()
                .divide(BigDecimal.valueOf(12 * 100), 10, RoundingMode.HALF_UP);
        int numPayments = loanAccount.getDurationMonths();

        // Calculate monthly payment
        BigDecimal onePlusRate = BigDecimal.ONE.add(monthlyRate);
        BigDecimal factor = BigDecimal.ONE.divide(
                onePlusRate.pow(numPayments).subtract(BigDecimal.ONE).negate()
                        .multiply(onePlusRate).negate(),
                10, RoundingMode.HALF_UP);
        BigDecimal monthlyPayment = principal.multiply(monthlyRate).multiply(factor).setScale(2, RoundingMode.HALF_UP);

        // Create payment schedule
        BigDecimal remainingBalance = principal;
        LocalDate paymentDate = loanAccount.getStartDate();

        for (int i = 1; i <= numPayments; i++) {
            // Calculate interest for this payment
            BigDecimal interestPayment = remainingBalance.multiply(monthlyRate).setScale(2, RoundingMode.HALF_UP);

            // Calculate principal for this payment
            BigDecimal principalPayment = monthlyPayment.subtract(interestPayment);

            // Adjust last payment to account for rounding errors
            if (i == numPayments) {
                principalPayment = remainingBalance;
                monthlyPayment = principalPayment.add(interestPayment);
            }

            // Update remaining balance
            remainingBalance = remainingBalance.subtract(principalPayment);

            // Create payment
            LoanPayment payment = new LoanPayment();
            payment.setLoanAccount(loanAccount);
            payment.setInstallmentNumber(i);
            payment.setDueDate(paymentDate.plusMonths(i));
            payment.setAmount(monthlyPayment);
            payment.setPrincipal(principalPayment);
            payment.setInterest(interestPayment);
            payment.setRemainingBalance(remainingBalance);
            payment.setStatus(LoanPayment.PaymentStatus.PENDING);

            payments.add(payment);
        }

        // Save all payments
        return loanPaymentRepository.saveAll(payments);
    }

    public void updatePaymentStatus() {
        LocalDate today = LocalDate.now();
        List<LoanPayment> pendingPayments = loanPaymentRepository.findAll().stream()
                .filter(p -> p.getStatus() == LoanPayment.PaymentStatus.PENDING && p.getDueDate().isBefore(today))
                .toList();

        for (LoanPayment payment : pendingPayments) {
            payment.setStatus(LoanPayment.PaymentStatus.OVERDUE);
            loanPaymentRepository.save(payment);
        }
    }

    @Transactional
    public void updateLoanStatuses() {
        // First update payment statuses
        updatePaymentStatus();

        // Then check for defaults (e.g., 3+ consecutive missed payments)
        LocalDate today = LocalDate.now();
        List<LoanAccount> activeLoans = loanAccountRepository.findByStatus(LoanAccount.LoanStatus.ACTIVE);

        for (LoanAccount loan : activeLoans) {
            long overdueCount = loan.getPayments().stream()
                    .filter(p -> p.getStatus() == LoanPayment.PaymentStatus.OVERDUE)
                    .count();

            // Get oldest overdue payment
            Optional<LoanPayment> oldestOverdue = loan.getPayments().stream()
                    .filter(p -> p.getStatus() == LoanPayment.PaymentStatus.OVERDUE)
                    .min(Comparator.comparing(LoanPayment::getDueDate));

            // Check if 3+ payments are overdue OR if oldest overdue is 90+ days past due
            if (overdueCount >= 3 || (oldestOverdue.isPresent() &&
                    ChronoUnit.DAYS.between(oldestOverdue.get().getDueDate(), today) >= 90)) {

                loan.setStatus(LoanAccount.LoanStatus.DEFAULTED);
                loanAccountRepository.save(loan);

                // Potentially notify the user or administrators
            }
        }
    }
}
