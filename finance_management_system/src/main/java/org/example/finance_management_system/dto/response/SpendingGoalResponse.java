package org.example.finance_management_system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.finance_management_system.model.SpendingGoal;
import org.example.finance_management_system.model.Transaction;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpendingGoalResponse {
    private Long id;
    private Transaction.Category category;
    private BigDecimal amountLimit;
    private SpendingGoal.Period period;
    private LocalDateTime createdAt;

    // Progress tracking
    private BigDecimal amountSpent;
    private BigDecimal percentageUsed;
    private boolean isWarning;

    public static SpendingGoalResponse fromEntity(SpendingGoal goal, BigDecimal amountSpent) {
        SpendingGoalResponse response = new SpendingGoalResponse();
        response.setId(goal.getId());
        response.setCategory(goal.getCategory());
        response.setAmountLimit(goal.getAmountLimit());
        response.setPeriod(goal.getPeriod());
        response.setCreatedAt(goal.getCreatedAt());

        // Calculate progress
        response.setAmountSpent(amountSpent);

        // Calculate percentage used (avoid division by zero)
        if (goal.getAmountLimit().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal percentage = amountSpent
                    .multiply(new BigDecimal("100"))
                    .divide(goal.getAmountLimit(), 2, RoundingMode.HALF_UP);
            response.setPercentageUsed(percentage);

            // Set warning flag if over 80% used
            response.setWarning(percentage.compareTo(new BigDecimal("80")) >= 0);
        } else {
            response.setPercentageUsed(BigDecimal.ZERO);
            response.setWarning(false);
        }

        return response;
    }
}
