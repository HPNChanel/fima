package org.example.finance_management_system.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transaction_templates")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private Transaction.TransactionType type;

    @Enumerated(EnumType.STRING)
    private Transaction.Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;

    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}