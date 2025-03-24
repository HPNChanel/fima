package org.example.finance_management_system.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.finance_management_system.model.SpendingGoal;
import org.example.finance_management_system.model.Transaction;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpendingGoalRequest {

    @NotNull(message = "Category is required")
    private Transaction.Category category;

    @NotNull(message = "Amount limit is required")
    @Positive(message = "Amount limit must be positive")
    private BigDecimal amountLimit;

    @NotNull(message = "Period is required")
    private SpendingGoal.Period period;
}

