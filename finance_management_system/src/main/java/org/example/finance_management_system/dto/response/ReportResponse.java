package org.example.finance_management_system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.finance_management_system.model.Report;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportResponse {
    private Long id;
    private String title;
    private Report.ReportType type;
    private LocalDate fromDate;
    private LocalDate toDate;
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;
    private String username;

    // Factory method to convert entity to DTO
    public static ReportResponse fromEntity(Report report) {
        ReportResponse response = new ReportResponse();
        response.setId(report.getId());
        response.setTitle(report.getTitle());
        response.setType(report.getType());
        response.setFromDate(report.getFromDate());
        response.setToDate(report.getToDate());
        response.setTotalIncome(report.getTotalIncome());
        response.setTotalExpense(report.getTotalExpense());
        response.setBalance(report.getTotalIncome().subtract(report.getTotalExpense()));
        response.setUsername(report.getUser().getUsername());
        return response;
    }
}
