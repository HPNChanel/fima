package org.example.finance_management_system.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "spending_goals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpendingGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private Transaction.Category category;

    @Column(name = "amount_limit", nullable = false)
    private BigDecimal amountLimit;

    @Enumerated(EnumType.STRING)
    @Column(name = "period", nullable = false)
    private Period period;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public enum Period {
        WEEKLY, MONTHLY, YEARLY
    }
}
