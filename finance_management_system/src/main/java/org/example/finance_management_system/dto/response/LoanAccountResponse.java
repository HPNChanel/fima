package org.example.finance_management_system.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import lombok.Data;
import org.example.finance_management_system.model.LoanAccount;
import org.example.finance_management_system.model.LoanPayment;

@Data
public class LoanAccountResponse {

    private Long id;
    private String name;
    private BigDecimal amount;
    private BigDecimal interestRate;
    private Integer durationMonths;
    private LocalDate startDate;
    private LocalDate endDate;
    private LoanAccount.LoanStatus status;
    private Long destinationAccountId;
    private String destinationAccountName;
    private List<LoanPaymentResponse> payments;
    private BigDecimal totalInterest;
    private BigDecimal totalAmount;
    private BigDecimal remainingBalance;
    private BigDecimal paidAmount;
    private Integer paidInstallments;
    private Integer remainingInstallments;
    private Double completionPercentage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static LoanAccountResponse fromEntity(LoanAccount loanAccount) {
        LoanAccountResponse response = new LoanAccountResponse();
        response.setId(loanAccount.getId());
        response.setName(loanAccount.getName());
        response.setAmount(loanAccount.getAmount());
        response.setInterestRate(loanAccount.getInterestRate());
        response.setDurationMonths(loanAccount.getDurationMonths());
        response.setStartDate(loanAccount.getStartDate());
        response.setEndDate(loanAccount.getEndDate());
        response.setStatus(loanAccount.getStatus());
        response.setDestinationAccountId(loanAccount.getDestinationAccount().getId());
        response.setDestinationAccountName(loanAccount.getDestinationAccount().getName());
        response.setCreatedAt(loanAccount.getCreatedAt());
        response.setUpdatedAt(loanAccount.getUpdatedAt());

        if (loanAccount.getPayments() != null && !loanAccount.getPayments().isEmpty()) {
            List<LoanPaymentResponse> paymentResponses = loanAccount.getPayments().stream()
                    .map(LoanPaymentResponse::fromEntity)
                    .collect(Collectors.toList());

            response.setPayments(paymentResponses);

            // Calculate totals and progress
            response.calculateTotals();
        }

        return response;
    }

    private void calculateTotals() {
        if (payments == null || payments.isEmpty()) {
            this.totalInterest = BigDecimal.ZERO;
            this.totalAmount = amount;
            this.remainingBalance = amount;
            this.paidAmount = BigDecimal.ZERO;
            this.paidInstallments = 0;
            this.remainingInstallments = durationMonths;
            this.completionPercentage = 0.0;
            return;
        }

        // Total amount (principal + interest)
        BigDecimal totalAmount = payments.stream()
                .map(LoanPaymentResponse::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        this.totalAmount = totalAmount;

        // Total interest
        BigDecimal totalInterest = payments.stream()
                .map(LoanPaymentResponse::getInterest)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        this.totalInterest = totalInterest;

        // Count paid installments
        long paidCount = payments.stream()
                .filter(p -> p.getStatus() == LoanPayment.PaymentStatus.PAID)
                .count();
        this.paidInstallments = (int) paidCount;
        this.remainingInstallments = durationMonths - paidInstallments;

        // Calculate paid amount
        BigDecimal paidAmount = payments.stream()
                .filter(p -> p.getStatus() == LoanPayment.PaymentStatus.PAID)
                .map(LoanPaymentResponse::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        this.paidAmount = paidAmount;

        // Calculate remaining balance
        this.remainingBalance = totalAmount.subtract(paidAmount);

        // Calculate completion percentage
        this.completionPercentage = (double) paidInstallments / durationMonths * 100;
    }
}
