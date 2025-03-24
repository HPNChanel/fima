package org.example.finance_management_system.dto.response;

import org.example.finance_management_system.model.Transfer;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransferResponse {
    private Long id;
    private AccountResponse sourceAccount;
    private AccountResponse destinationAccount;
    private BigDecimal amount;
    private String description;
    private LocalDateTime date;
    private Long userId;

    public static TransferResponse fromEntity(Transfer transfer) {
        TransferResponse response = new TransferResponse();
        response.setId(transfer.getId());

        if (transfer.getSourceAccount() != null) {
            response.setSourceAccount(AccountResponse.fromEntity(transfer.getSourceAccount()));
        }

        if (transfer.getDestinationAccount() != null) {
            response.setDestinationAccount(AccountResponse.fromEntity(transfer.getDestinationAccount()));
        }

        response.setAmount(transfer.getAmount());
        response.setDescription(transfer.getDescription());
        response.setDate(transfer.getDate());

        if (transfer.getUser() != null) {
            response.setUserId(transfer.getUser().getId());
        }

        return response;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AccountResponse getSourceAccount() {
        return sourceAccount;
    }

    public void setSourceAccount(AccountResponse sourceAccount) {
        this.sourceAccount = sourceAccount;
    }

    public AccountResponse getDestinationAccount() {
        return destinationAccount;
    }

    public void setDestinationAccount(AccountResponse destinationAccount) {
        this.destinationAccount = destinationAccount;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}

