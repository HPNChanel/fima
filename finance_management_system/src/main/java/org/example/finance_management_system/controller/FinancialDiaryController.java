package org.example.finance_management_system.controller;

import org.example.finance_management_system.dto.request.FinancialDiaryRequest;
import org.example.finance_management_system.dto.response.FinancialDiaryResponse;
import org.example.finance_management_system.dto.response.MessageResponse;
import org.example.finance_management_system.exception.BadRequestException;
import org.example.finance_management_system.exception.ResourceNotFoundException;
import org.example.finance_management_system.model.FinancialDiaryEntry;
import org.example.finance_management_system.model.User;
import org.example.finance_management_system.repository.FinancialDiaryRepository;
import org.example.finance_management_system.repository.UserRepository;
import org.example.finance_management_system.security.services.UserDetailsImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class FinancialDiaryController {

    private static final Logger logger = LoggerFactory.getLogger(FinancialDiaryController.class);

    @Autowired
    private FinancialDiaryRepository financialDiaryRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping({"/diary", "/api/diary"})
    public ResponseEntity<?> getAllDiaryEntries(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String goal) {

        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        List<FinancialDiaryEntry> entries;

        if (startDate != null && endDate != null) {
            // Filter by date range
            entries = financialDiaryRepository.findByUserIdAndEntryDateBetweenOrderByEntryDateDesc(
                    userDetails.getId(), startDate, endDate);
        } else if (search != null && !search.trim().isEmpty()) {
            // Search in title and content
            entries = financialDiaryRepository.findByUserIdAndTitleContainingOrContentContainingOrderByEntryDateDesc(
                    userDetails.getId(), search, search);
        } else if (tag != null && !tag.trim().isEmpty()) {
            // Filter by tag
            entries = financialDiaryRepository.findByUserIdAndTagsContainingOrderByEntryDateDesc(
                    userDetails.getId(), tag);
        } else if (goal != null && !goal.trim().isEmpty()) {
            // Filter by financial goal
            entries = financialDiaryRepository.findByUserIdAndFinancialGoalContainingOrderByEntryDateDesc(
                    userDetails.getId(), goal);
        } else {
            // Get all entries
            entries = financialDiaryRepository.findByUserIdOrderByEntryDateDesc(userDetails.getId());
        }

        List<FinancialDiaryResponse> response = entries.stream()
                .map(FinancialDiaryResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping({"/diary/{id}", "/api/diary/{id}"})
    public ResponseEntity<?> getDiaryEntryById(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        FinancialDiaryEntry entry = financialDiaryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Diary Entry", "id", id));

        // Check if entry belongs to the authenticated user
        if (!entry.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("You don't have permission to view this diary entry"));
        }

        return ResponseEntity.ok(FinancialDiaryResponse.fromEntity(entry));
    }

    @GetMapping({"/diary/date/{date}", "/api/diary/date/{date}"})
    public ResponseEntity<?> getDiaryEntryByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        FinancialDiaryEntry entry = financialDiaryRepository.findByUserIdAndEntryDate(userDetails.getId(), date)
                .orElseThrow(() -> new ResourceNotFoundException("Diary Entry", "date", date));

        return ResponseEntity.ok(FinancialDiaryResponse.fromEntity(entry));
    }

    @PostMapping({"/diary", "/api/diary"})
    public ResponseEntity<?> createDiaryEntry(@Valid @RequestBody FinancialDiaryRequest request) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();

            // Check if entry already exists for this date
            if (financialDiaryRepository.existsByUserIdAndEntryDate(userDetails.getId(), request.getEntryDate())) {
                throw new BadRequestException("A diary entry already exists for this date");
            }

            // Get user
            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userDetails.getId()));

            // Create new diary entry
            FinancialDiaryEntry entry = new FinancialDiaryEntry();
            entry.setTitle(request.getTitle());
            entry.setContent(request.getContent());
            entry.setEntryDate(request.getEntryDate());
            entry.setRelatedAmount(request.getRelatedAmount());
            entry.setFinancialGoal(request.getFinancialGoal());
            entry.setLessonsLearned(request.getLessonsLearned());
            entry.setTags(request.getTags());
            entry.setUser(user);

            // Save the entry
            financialDiaryRepository.save(entry);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(FinancialDiaryResponse.fromEntity(entry));

        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Error creating diary entry", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error creating diary entry: " + e.getMessage()));
        }
    }

    @PutMapping({"/diary/{id}", "/api/diary/{id}"})
    public ResponseEntity<?> updateDiaryEntry(
            @PathVariable Long id,
            @Valid @RequestBody FinancialDiaryRequest request) {

        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();

            FinancialDiaryEntry entry = financialDiaryRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Diary Entry", "id", id));

            // Check if entry belongs to the authenticated user
            if (!entry.getUser().getId().equals(userDetails.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("You don't have permission to update this diary entry"));
            }

            // Check if new date conflicts with an existing entry (only if date is changed)
            if (!entry.getEntryDate().equals(request.getEntryDate()) &&
                    financialDiaryRepository.existsByUserIdAndEntryDate(userDetails.getId(), request.getEntryDate())) {
                throw new BadRequestException("A diary entry already exists for the new date");
            }

            // Update entry fields
            entry.setTitle(request.getTitle());
            entry.setContent(request.getContent());
            entry.setEntryDate(request.getEntryDate());
            entry.setRelatedAmount(request.getRelatedAmount());
            entry.setFinancialGoal(request.getFinancialGoal());
            entry.setLessonsLearned(request.getLessonsLearned());
            entry.setTags(request.getTags());

            // Save updated entry
            financialDiaryRepository.save(entry);

            return ResponseEntity.ok(FinancialDiaryResponse.fromEntity(entry));

        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Error updating diary entry", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error updating diary entry: " + e.getMessage()));
        }
    }

    @DeleteMapping({"/diary/{id}", "/api/diary/{id}"})
    public ResponseEntity<?> deleteDiaryEntry(@PathVariable Long id) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();

            FinancialDiaryEntry entry = financialDiaryRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Diary Entry", "id", id));

            // Check if entry belongs to the authenticated user
            if (!entry.getUser().getId().equals(userDetails.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("You don't have permission to delete this diary entry"));
            }

            // Delete the entry
            financialDiaryRepository.delete(entry);

            return ResponseEntity.ok(new MessageResponse("Diary entry deleted successfully"));

        } catch (Exception e) {
            logger.error("Error deleting diary entry", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error deleting diary entry: " + e.getMessage()));
        }
    }

    @GetMapping({"/diary/stats", "/api/diary/stats"})
    public ResponseEntity<?> getDiaryStats() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        // Get all entries for the user
        List<FinancialDiaryEntry> entries = financialDiaryRepository.findByUserIdOrderByEntryDateDesc(userDetails.getId());

        // Calculate statistics
        int totalEntries = entries.size();

        // Count entries by goal
        var goalCounts = entries.stream()
                .filter(e -> e.getFinancialGoal() != null && !e.getFinancialGoal().isEmpty())
                .collect(Collectors.groupingBy(FinancialDiaryEntry::getFinancialGoal, Collectors.counting()));

        // Get most recent entry date
        LocalDate mostRecentDate = entries.isEmpty() ? null :
                entries.get(0).getEntryDate();

        // Calculate streak (consecutive days)
        int streak = calculateStreak(entries);

        // Create response object
        var stats = new Object() {
            public final int total = totalEntries;
            public final Object goals = goalCounts;
            public final LocalDate lastEntryDate = mostRecentDate;
            public final int currentStreak = streak;
        };

        return ResponseEntity.ok(stats);
    }

    private int calculateStreak(List<FinancialDiaryEntry> entries) {
        if (entries.isEmpty()) {
            return 0;
        }

        // Sort entries by date (most recent first)
        entries.sort((a, b) -> b.getEntryDate().compareTo(a.getEntryDate()));

        LocalDate today = LocalDate.now();
        LocalDate lastEntryDate = entries.get(0).getEntryDate();

        // If the most recent entry is not from today or yesterday, streak is 0
        if (lastEntryDate.isBefore(today.minusDays(1))) {
            return 0;
        }

        int streak = 1;
        LocalDate currentDate = lastEntryDate;

        for (int i = 1; i < entries.size(); i++) {
            LocalDate previousDate = entries.get(i).getEntryDate();

            // If entries are consecutive days, increment streak
            if (currentDate.minusDays(1).equals(previousDate)) {
                streak++;
                currentDate = previousDate;
            } else {
                break;
            }
        }

        return streak;
    }
}
