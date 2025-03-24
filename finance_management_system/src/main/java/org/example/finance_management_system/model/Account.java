package org.example.finance_management_system.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;  // Account name (e.g., "My Cash Wallet", "Main Bank Account")

    @NotNull
    @Enumerated(EnumType.STRING)
    private AccountType type;  // Type of account (CASH, BANK, CREDIT_CARD, E_WALLET)

    @NotNull
    private BigDecimal balance;  // Current balance

    private String accountNumber;  // Optional account number or identifier

    private String description;  // Optional description

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relationship: Many accounts belong to one user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  // User who owns this account

    // Account types
    public enum AccountType {
        CASH, BANK, CREDIT_CARD, E_WALLET
    }

    // Pre-persist hook to set creation time
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    // Pre-update hook to update the modification time
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}