package org.example.finance_management_system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.finance_management_system.model.TransactionHistory;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionHistoryResponse {
    private Long id;
    private Long transactionId;
    private String oldValue;
    private String newValue;
    private LocalDateTime changedAt;
    private String changedBy;
    private String changeType;

    public static TransactionHistoryResponse fromEntity(TransactionHistory history) {
        TransactionHistoryResponse response = new TransactionHistoryResponse();
        response.setId(history.getId());
        response.setTransactionId(history.getTransactionId());
        response.setOldValue(history.getOldValue());
        response.setNewValue(history.getNewValue());
        response.setChangedAt(history.getChangedAt());
        response.setChangedBy(history.getChangedBy());
        response.setChangeType(history.getChangeType());
        return response;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }

    public String getOldValue() {
        return oldValue;
    }

    public void setOldValue(String oldValue) {
        this.oldValue = oldValue;
    }

    public String getNewValue() {
        return newValue;
    }

    public void setNewValue(String newValue) {
        this.newValue = newValue;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }

    public void setChangedAt(LocalDateTime changedAt) {
        this.changedAt = changedAt;
    }

    public String getChangedBy() {
        return changedBy;
    }

    public void setChangedBy(String changedBy) {
        this.changedBy = changedBy;
    }

    public String getChangeType() {
        return changeType;
    }

    public void setChangeType(String changeType) {
        this.changeType = changeType;
    }
}
