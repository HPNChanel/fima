package org.example.finance_management_system.dto.response;

import org.example.finance_management_system.model.SavingsAccount;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

public class SavingsAccountResponse {
    private Long id;
    private String name;
    private BigDecimal initialDeposit;
    private BigDecimal interestRate;
    private SavingsAccount.TermType termType;
    private String tag;
    private LocalDate startDate;
    private LocalDate maturityDate;
    private SavingsAccount.SavingsStatus status;
    private LocalDate withdrawalDate;
    private Long sourceAccountId;
    private String sourceAccountName;
    private BigDecimal currentValue;
    private BigDecimal totalInterest;
    private BigDecimal dailyInterest;
    private long daysRemaining;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static SavingsAccountResponse fromEntity(SavingsAccount savingsAccount) {
        SavingsAccountResponse response = new SavingsAccountResponse();
        response.setId(savingsAccount.getId());
        response.setName(savingsAccount.getName());
        response.setInitialDeposit(savingsAccount.getInitialDeposit());
        response.setInterestRate(savingsAccount.getInterestRate());
        response.setTermType(savingsAccount.getTermType());
        response.setTag(savingsAccount.getTag());
        response.setStartDate(savingsAccount.getStartDate());
        response.setMaturityDate(savingsAccount.getMaturityDate());
        response.setStatus(savingsAccount.getStatus());
        response.setWithdrawalDate(savingsAccount.getWithdrawalDate());
        response.setSourceAccountId(savingsAccount.getSourceAccount().getId());
        response.setSourceAccountName(savingsAccount.getSourceAccount().getName());
        response.setCreatedAt(savingsAccount.getCreatedAt());
        response.setUpdatedAt(savingsAccount.getUpdatedAt());

        // Calculate current value and interests
        response.calculateValues();

        return response;
    }

    private void calculateValues() {
        if (status == SavingsAccount.SavingsStatus.WITHDRAWN) {
            // If withdrawn early, no additional interest
            this.currentValue = initialDeposit;
            this.totalInterest = BigDecimal.ZERO;
            this.dailyInterest = BigDecimal.ZERO;
            this.daysRemaining = 0;
            return;
        }

        LocalDate today = LocalDate.now();
        LocalDate endDate = today.isAfter(maturityDate) ? maturityDate : today;

        // Calculate days elapsed from start to now (or maturity)
        long daysElapsed = ChronoUnit.DAYS.between(startDate, endDate);

        // Calculate days remaining until maturity
        this.daysRemaining = status == SavingsAccount.SavingsStatus.MATURED ?
                0 : ChronoUnit.DAYS.between(today, maturityDate);

        if (daysRemaining < 0) {
            this.daysRemaining = 0;
        }

        // Calculate daily interest rate (annual rate / 365)
        BigDecimal dailyRate = interestRate.divide(BigDecimal.valueOf(36500), 10, BigDecimal.ROUND_HALF_UP);

        // Simple interest calculation
        this.dailyInterest = initialDeposit.multiply(dailyRate).setScale(2, BigDecimal.ROUND_HALF_UP);
        this.totalInterest = dailyInterest.multiply(BigDecimal.valueOf(daysElapsed)).setScale(2, BigDecimal.ROUND_HALF_UP);
        this.currentValue = initialDeposit.add(totalInterest);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getInitialDeposit() {
        return initialDeposit;
    }

    public void setInitialDeposit(BigDecimal initialDeposit) {
        this.initialDeposit = initialDeposit;
    }

    public BigDecimal getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(BigDecimal interestRate) {
        this.interestRate = interestRate;
    }

    public SavingsAccount.TermType getTermType() {
        return termType;
    }

    public void setTermType(SavingsAccount.TermType termType) {
        this.termType = termType;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getMaturityDate() {
        return maturityDate;
    }

    public void setMaturityDate(LocalDate maturityDate) {
        this.maturityDate = maturityDate;
    }

    public SavingsAccount.SavingsStatus getStatus() {
        return status;
    }

    public void setStatus(SavingsAccount.SavingsStatus status) {
        this.status = status;
    }

    public LocalDate getWithdrawalDate() {
        return withdrawalDate;
    }

    public void setWithdrawalDate(LocalDate withdrawalDate) {
        this.withdrawalDate = withdrawalDate;
    }

    public Long getSourceAccountId() {
        return sourceAccountId;
    }

    public void setSourceAccountId(Long sourceAccountId) {
        this.sourceAccountId = sourceAccountId;
    }

    public String getSourceAccountName() {
        return sourceAccountName;
    }

    public void setSourceAccountName(String sourceAccountName) {
        this.sourceAccountName = sourceAccountName;
    }

    public BigDecimal getCurrentValue() {
        return currentValue;
    }

    public void setCurrentValue(BigDecimal currentValue) {
        this.currentValue = currentValue;
    }

    public BigDecimal getTotalInterest() {
        return totalInterest;
    }

    public void setTotalInterest(BigDecimal totalInterest) {
        this.totalInterest = totalInterest;
    }

    public BigDecimal getDailyInterest() {
        return dailyInterest;
    }

    public void setDailyInterest(BigDecimal dailyInterest) {
        this.dailyInterest = dailyInterest;
    }

    public long getDaysRemaining() {
        return daysRemaining;
    }

    public void setDaysRemaining(long daysRemaining) {
        this.daysRemaining = daysRemaining;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
