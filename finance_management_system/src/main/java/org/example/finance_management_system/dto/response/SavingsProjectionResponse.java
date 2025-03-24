package org.example.finance_management_system.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class SavingsProjectionResponse {
    private BigDecimal initialDeposit;
    private BigDecimal interestRate;
    private LocalDate startDate;
    private LocalDate maturityDate;
    private BigDecimal totalInterest;
    private BigDecimal finalAmount;
    private BigDecimal dailyInterest;
    private BigDecimal monthlyInterest;
    private BigDecimal yearlyInterest;
    private List<ProjectionEntry> timeline;

    public static class ProjectionEntry {
        private LocalDate date;
        private BigDecimal cumulativeInterest;
        private BigDecimal totalValue;

        public ProjectionEntry(LocalDate date, BigDecimal cumulativeInterest, BigDecimal totalValue) {
            this.date = date;
            this.cumulativeInterest = cumulativeInterest;
            this.totalValue = totalValue;
        }

        public LocalDate getDate() {
            return date;
        }

        public void setDate(LocalDate date) {
            this.date = date;
        }

        public BigDecimal getCumulativeInterest() {
            return cumulativeInterest;
        }

        public void setCumulativeInterest(BigDecimal cumulativeInterest) {
            this.cumulativeInterest = cumulativeInterest;
        }

        public BigDecimal getTotalValue() {
            return totalValue;
        }

        public void setTotalValue(BigDecimal totalValue) {
            this.totalValue = totalValue;
        }
    }

    // Getters and Setters
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

    public BigDecimal getTotalInterest() {
        return totalInterest;
    }

    public void setTotalInterest(BigDecimal totalInterest) {
        this.totalInterest = totalInterest;
    }

    public BigDecimal getFinalAmount() {
        return finalAmount;
    }

    public void setFinalAmount(BigDecimal finalAmount) {
        this.finalAmount = finalAmount;
    }

    public BigDecimal getDailyInterest() {
        return dailyInterest;
    }

    public void setDailyInterest(BigDecimal dailyInterest) {
        this.dailyInterest = dailyInterest;
    }

    public BigDecimal getMonthlyInterest() {
        return monthlyInterest;
    }

    public void setMonthlyInterest(BigDecimal monthlyInterest) {
        this.monthlyInterest = monthlyInterest;
    }

    public BigDecimal getYearlyInterest() {
        return yearlyInterest;
    }

    public void setYearlyInterest(BigDecimal yearlyInterest) {
        this.yearlyInterest = yearlyInterest;
    }

    public List<ProjectionEntry> getTimeline() {
        return timeline;
    }

    public void setTimeline(List<ProjectionEntry> timeline) {
        this.timeline = timeline;
    }
}
