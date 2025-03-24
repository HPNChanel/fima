package org.example.finance_management_system.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;                    // Unique identifier

    @NotBlank
    private String title;               // Report title

    @NotNull
    @Enumerated(EnumType.STRING)
    private ReportType type;            // Type of report

    @NotNull
    private LocalDate fromDate;         // Start date of report period

    @NotNull
    private LocalDate toDate;           // End date of report period

    private BigDecimal totalIncome;     // Sum of income in period

    private BigDecimal totalExpense;    // Sum of expenses in period

    // Relationship: Many reports belong to one user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;                  // User who owns this report

    public enum ReportType {
        DAILY, WEEKLY, MONTHLY, YEARLY, CUSTOM
    }
}
