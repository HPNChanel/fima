package org.example.finance_management_system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.finance_management_system.model.Account;
import org.example.finance_management_system.model.Transaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private Long id;
    private String description;
    private BigDecimal amount;
    private Transaction.TransactionType type;
    private Transaction.Category category;
    private LocalDateTime date;
    private String username;

    // Add account information
    private Long accountId;
    private String accountName;
    private Account.AccountType accountType;

    private String notes;

    // Factory method to convert entity to DTO
    public static TransactionResponse fromEntity(Transaction transaction) {
        TransactionResponse response = new TransactionResponse();
        response.setId(transaction.getId());
        response.setDescription(transaction.getDescription());
        response.setAmount(transaction.getAmount());
        response.setType(transaction.getType());
        response.setCategory(transaction.getCategory());
        response.setDate(transaction.getDate());
        response.setUsername(transaction.getUser().getUsername());

        if (transaction.getAccount() != null) {
            response.setAccountId(transaction.getAccount().getId());
            response.setAccountName(transaction.getAccount().getName());
            response.setAccountType(transaction.getAccount().getType());
        }

        response.setNotes(transaction.getNotes());

        return response;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
