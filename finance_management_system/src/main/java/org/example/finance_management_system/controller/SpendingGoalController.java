package org.example.finance_management_system.controller;

import jakarta.validation.Valid;
import org.example.finance_management_system.dto.request.SpendingGoalRequest;
import org.example.finance_management_system.dto.response.MessageResponse;
import org.example.finance_management_system.dto.response.SpendingGoalResponse;
import org.example.finance_management_system.exception.ResourceNotFoundException;
import org.example.finance_management_system.model.SpendingGoal;
import org.example.finance_management_system.model.Transaction;
import org.example.finance_management_system.model.User;
import org.example.finance_management_system.repository.SpendingGoalRepository;
import org.example.finance_management_system.repository.TransactionRepository;
import org.example.finance_management_system.repository.UserRepository;
import org.example.finance_management_system.security.services.UserDetailsImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class SpendingGoalController {

    @Autowired
    private SpendingGoalRepository spendingGoalRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    private static final Logger logger = LoggerFactory.getLogger(SpendingGoalController.class);

    @GetMapping({"/spending-goals", "/api/spending-goals"})
    public ResponseEntity<?> getAllSpendingGoals() {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();

            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userDetails.getId()));

            List<SpendingGoal> goals = spendingGoalRepository.findByUserOrderByCreatedAtDesc(user);

            List<SpendingGoalResponse> responses = goals.stream()
                    .map(goal -> {
                        BigDecimal amountSpent = calculateAmountSpent(user, goal.getCategory(), goal.getPeriod());
                        return SpendingGoalResponse.fromEntity(goal, amountSpent);
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            logger.error("Error fetching spending goals", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error fetching spending goals: " + e.getMessage()));
        }
    }

    @PostMapping({"/spending-goals", "/api/spending-goals"})
    public ResponseEntity<?> createSpendingGoal(@Valid @RequestBody SpendingGoalRequest request) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();

            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userDetails.getId()));

            // Check if spending goal already exists for this user, category, and period
            if (spendingGoalRepository.existsByUserAndCategoryAndPeriod(user, request.getCategory(), request.getPeriod())) {
                // Update existing goal instead of creating a new one
                SpendingGoal existingGoal = spendingGoalRepository
                        .findByUserAndCategoryAndPeriod(user, request.getCategory(), request.getPeriod())
                        .orElseThrow();

                existingGoal.setAmountLimit(request.getAmountLimit());
                existingGoal.setCreatedAt(LocalDateTime.now());

                SpendingGoal savedGoal = spendingGoalRepository.save(existingGoal);
                BigDecimal amountSpent = calculateAmountSpent(user, savedGoal.getCategory(), savedGoal.getPeriod());

                return ResponseEntity.ok(SpendingGoalResponse.fromEntity(savedGoal, amountSpent));
            }

            // Create new spending goal
            SpendingGoal goal = new SpendingGoal();
            goal.setUser(user);
            goal.setCategory(request.getCategory());
            goal.setAmountLimit(request.getAmountLimit());
            goal.setPeriod(request.getPeriod());
            goal.setCreatedAt(LocalDateTime.now());

            SpendingGoal savedGoal = spendingGoalRepository.save(goal);
            BigDecimal amountSpent = calculateAmountSpent(user, savedGoal.getCategory(), savedGoal.getPeriod());

            return ResponseEntity.ok(SpendingGoalResponse.fromEntity(savedGoal, amountSpent));
        } catch (Exception e) {
            logger.error("Error creating spending goal", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error creating spending goal: " + e.getMessage()));
        }
    }

    @DeleteMapping({"/spending-goals/{id}", "/api/spending-goals/{id}"})
    public ResponseEntity<?> deleteSpendingGoal(@PathVariable Long id) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();

            SpendingGoal goal = spendingGoalRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Spending Goal", "id", id));

            // Check if goal belongs to current user
            if (!goal.getUser().getId().equals(userDetails.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("You don't have permission to delete this spending goal"));
            }

            spendingGoalRepository.delete(goal);
            return ResponseEntity.ok(new MessageResponse("Spending goal deleted successfully"));
        } catch (Exception e) {
            logger.error("Error deleting spending goal", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error deleting spending goal: " + e.getMessage()));
        }
    }

    // Helper method to calculate amount spent based on period
    private BigDecimal calculateAmountSpent(User user, Transaction.Category category, SpendingGoal.Period period) {
        LocalDateTime startDate;
        LocalDateTime endDate = LocalDateTime.now();
        LocalDate today = LocalDate.now();

        // Calculate start date based on period
        switch (period) {
            case WEEKLY:
                // Start from the beginning of the current week (Monday)
                startDate = today.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY))
                        .atTime(LocalTime.MIN);
                break;
            case MONTHLY:
                // Start from the beginning of the current month
                startDate = today.withDayOfMonth(1).atTime(LocalTime.MIN);
                break;
            case YEARLY:
                // Start from the beginning of the current year
                startDate = today.withDayOfYear(1).atTime(LocalTime.MIN);
                break;
            default:
                // Default to beginning of month
                startDate = today.withDayOfMonth(1).atTime(LocalTime.MIN);
        }

        // Sum of all expenses in the specified category and period
        return transactionRepository.sumExpensesByUserCategoryAndDateRange(
                user.getId(), category, startDate, endDate);
    }
}
