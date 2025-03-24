package org.example.finance_management_system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.finance_management_system.model.Account;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountResponse {
    private Long id;
    private String name;
    private Account.AccountType type;
    private BigDecimal balance;
    private String accountNumber;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Factory method to convert entity to DTO
    public static AccountResponse fromEntity(Account account) {
        AccountResponse response = new AccountResponse();
        response.setId(account.getId());
        response.setName(account.getName());
        response.setType(account.getType());
        response.setBalance(account.getBalance());
        response.setAccountNumber(account.getAccountNumber());
        response.setDescription(account.getDescription());
        response.setCreatedAt(account.getCreatedAt());
        response.setUpdatedAt(account.getUpdatedAt());
        return response;
    }
}
