package org.example.finance_management_system.controller;

import jakarta.validation.Valid;
import org.example.finance_management_system.dto.request.ReportRequest;
import org.example.finance_management_system.dto.response.MessageResponse;
import org.example.finance_management_system.dto.response.ReportResponse;
import org.example.finance_management_system.exception.ResourceNotFoundException;
import org.example.finance_management_system.model.Report;
import org.example.finance_management_system.model.Transaction;
import org.example.finance_management_system.model.User;
import org.example.finance_management_system.repository.ReportRepository;
import org.example.finance_management_system.repository.TransactionRepository;
import org.example.finance_management_system.repository.UserRepository;
import org.example.finance_management_system.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class ReportController {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    // Add logger declaration
    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);

    @GetMapping({"/reports", "/api/reports"})
    public ResponseEntity<?> getAllReports() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Report> reports = reportRepository.findByUserId(userDetails.getId());
        List<ReportResponse> reportResponses = reports.stream()
                .map(ReportResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(reportResponses);
    }

    @GetMapping({"/reports/{id}", "/api/reports/{id}"})
    public ResponseEntity<?> getReportById(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report", "id", id));

        // Check if report belongs to authenticated user
        if(!report.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(403).body(new MessageResponse("You don't have permission to access this report"));
        }

        return ResponseEntity.ok(ReportResponse.fromEntity(report));
    }

    @PostMapping({"/reports", "/api/reports"})
    public ResponseEntity<?> createReport(@Valid @RequestBody ReportRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userDetails.getId()));

        // Calculate totals based on transactions within date range
        LocalDateTime startDateTime = request.getFromDate().atStartOfDay();
        LocalDateTime endDateTime = request.getToDate().atTime(LocalTime.MAX);

        List<Transaction> transactions = transactionRepository.findByUserIdAndDateBetween(
                userDetails.getId(), startDateTime, endDateTime);

        BigDecimal income = calculateTotalIncome(transactions);
        BigDecimal expense = calculateTotalExpense(transactions);

        Report report = new Report();
        report.setTitle(request.getTitle());
        report.setType(request.getType());
        report.setFromDate(request.getFromDate());
        report.setToDate(request.getToDate());
        report.setTotalIncome(income);
        report.setTotalExpense(expense);
        report.setUser(user);

        reportRepository.save(report);

        return ResponseEntity.ok(ReportResponse.fromEntity(report));
    }

    @PutMapping({"/reports/{id}", "/api/reports/{id}"})
    public ResponseEntity<?> updateReport(@PathVariable Long id, @Valid @RequestBody ReportRequest reportRequest) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report", "id", id));

        // Check if report belongs to authenticated user
        if(!report.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(403).body(new MessageResponse("You don't have permission to update this report"));
        }

        // Recalculate totals based on new date range
        LocalDateTime startDateTime = reportRequest.getFromDate().atStartOfDay();
        LocalDateTime endDateTime = reportRequest.getToDate().atTime(LocalTime.MAX);

        List<Transaction> transactions = transactionRepository.findByUserIdAndDateBetween(
                userDetails.getId(), startDateTime, endDateTime);

        BigDecimal totalIncome = transactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.INCOME)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpense = transactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        report.setTitle(reportRequest.getTitle());
        report.setType(reportRequest.getType());
        report.setFromDate(reportRequest.getFromDate());
        report.setToDate(reportRequest.getToDate());
        report.setTotalIncome(totalIncome);
        report.setTotalExpense(totalExpense);

        reportRepository.save(report);

        return ResponseEntity.ok(ReportResponse.fromEntity(report));
    }

    @DeleteMapping({"/reports/{id}", "/api/reports/{id}"})
    public ResponseEntity<?> deleteReport(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report", "id", id));

        // Check if report belongs to authenticated user
        if(!report.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(403).body(new MessageResponse("You don't have permission to delete this report"));
        }

        reportRepository.delete(report);

        return ResponseEntity.ok(new MessageResponse("Report deleted successfully"));
    }

    @GetMapping({"/reports/by-type/{type}", "/api/reports/by-type/{type}"})
    public ResponseEntity<?> getReportsByType(@PathVariable Report.ReportType type) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<Report> reports = reportRepository.findByUserIdAndType(userDetails.getId(), type);
        List<ReportResponse> reportResponses = reports.stream()
                .map(ReportResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(reportResponses);
    }

    @GetMapping({"/reports/spending-comparison", "/api/reports/spending-comparison"})
    public ResponseEntity<?> getSpendingComparison() {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();

            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userDetails.getId()));

            // Get first day of current month
            LocalDate currentMonth = LocalDate.now().with(TemporalAdjusters.firstDayOfMonth());
            LocalDateTime currentMonthStart = currentMonth.atStartOfDay();
            LocalDateTime currentMonthEnd = LocalDate.now().atTime(23, 59, 59);

            // Get first and last day of previous month
            LocalDate previousMonth = currentMonth.minusMonths(1);
            LocalDateTime previousMonthStart = previousMonth.atStartOfDay();
            LocalDateTime previousMonthEnd = previousMonth.with(TemporalAdjusters.lastDayOfMonth()).atTime(23, 59, 59);

            // Get expenses for current month
            BigDecimal currentMonthTotal = transactionRepository.sumExpensesByUserAndDateRange(
                    user.getId(),
                    Transaction.TransactionType.EXPENSE,
                    currentMonthStart,
                    currentMonthEnd);

            // Get expenses for previous month
            BigDecimal previousMonthTotal = transactionRepository.sumExpensesByUserAndDateRange(
                    user.getId(),
                    Transaction.TransactionType.EXPENSE,
                    previousMonthStart,
                    previousMonthEnd);

            // Calculate difference and percentage change
            BigDecimal difference = currentMonthTotal.subtract(previousMonthTotal);

            BigDecimal percentageChange = BigDecimal.ZERO;
            if (previousMonthTotal.compareTo(BigDecimal.ZERO) > 0) {
                percentageChange = difference
                        .multiply(new BigDecimal("100"))
                        .divide(previousMonthTotal, 2, RoundingMode.HALF_UP);
            }

            // Create response map
            Map<String, Object> response = new HashMap<>();
            response.put("currentMonthTotal", currentMonthTotal);
            response.put("previousMonthTotal", previousMonthTotal);
            response.put("difference", difference);
            response.put("percentageChange", percentageChange);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error calculating spending comparison", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error calculating spending comparison: " + e.getMessage()));
        }
    }

    // Helper methods
    private BigDecimal calculateTotalIncome(List<Transaction> transactions) {
        return transactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.INCOME)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal calculateTotalExpense(List<Transaction> transactions) {
        return transactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}

