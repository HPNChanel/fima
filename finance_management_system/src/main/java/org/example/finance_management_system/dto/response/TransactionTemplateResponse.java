package org.example.finance_management_system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.finance_management_system.model.Transaction;
import org.example.finance_management_system.model.TransactionTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionTemplateResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal amount;
    private Transaction.TransactionType type;
    private Transaction.Category category;
    private Long accountId;
    private String accountName;
    private String notes;
    private LocalDateTime createdAt;

    public static TransactionTemplateResponse fromEntity(TransactionTemplate template) {
        TransactionTemplateResponse response = new TransactionTemplateResponse();
        response.setId(template.getId());
        response.setName(template.getName());
        response.setDescription(template.getDescription());
        response.setAmount(template.getAmount());
        response.setType(template.getType());
        response.setCategory(template.getCategory());

        if (template.getAccount() != null) {
            response.setAccountId(template.getAccount().getId());
            response.setAccountName(template.getAccount().getName());
        }

        response.setNotes(template.getNotes());
        response.setCreatedAt(template.getCreatedAt());

        return response;
    }
}
