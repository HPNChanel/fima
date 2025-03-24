package org.example.finance_management_system.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import org.example.finance_management_system.model.SavingsAccount;

import java.math.BigDecimal;
import java.time.LocalDate;

public class SavingsAccountRequest {

    @Size(min = 3, max = 255, message = "Savings account name must be between 3 and 255 characters")
    @NotNull(message = "Name is required")
    private String name;

    @NotNull(message = "Initial deposit amount is required")
    @Positive(message = "Initial deposit must be positive")
    private BigDecimal initialDeposit;

    @NotNull(message = "Interest rate is required")
    @Positive(message = "Interest rate must be positive")
    private BigDecimal interestRate;

    @NotNull(message = "Term type is required")
    private SavingsAccount.TermType termType;

    @Size(max = 255, message = "Tag must be less than 255 characters")
    private String tag;

    @NotNull(message = "Source account ID is required")
    private Long sourceAccountId;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

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

    public Long getSourceAccountId() {
        return sourceAccountId;
    }

    public void setSourceAccountId(Long sourceAccountId) {
        this.sourceAccountId = sourceAccountId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
}
