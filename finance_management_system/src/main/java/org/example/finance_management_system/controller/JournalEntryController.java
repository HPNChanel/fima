package org.example.finance_management_system.controller;

import org.example.finance_management_system.dto.request.JournalEntryRequest;
import org.example.finance_management_system.dto.response.JournalEntryResponse;
import org.example.finance_management_system.dto.response.MessageResponse;
import org.example.finance_management_system.exception.BadRequestException;
import org.example.finance_management_system.exception.ResourceNotFoundException;
import org.example.finance_management_system.model.JournalEntry;
import org.example.finance_management_system.model.User;
import org.example.finance_management_system.repository.JournalEntryRepository;
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
public class JournalEntryController {

    private static final Logger logger = LoggerFactory.getLogger(JournalEntryController.class);

    @Autowired
    private JournalEntryRepository journalEntryRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping({"/journal", "/api/journal"})
    public ResponseEntity<?> getAllJournalEntries(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String mood) {

        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        List<JournalEntry> entries;

        if (startDate != null && endDate != null) {
            // Filter by date range
            entries = journalEntryRepository.findByUserIdAndEntryDateBetweenOrderByEntryDateDesc(
                    userDetails.getId(), startDate, endDate);
        } else if (search != null && !search.trim().isEmpty()) {
            // Search in title and content
            entries = journalEntryRepository.findByUserIdAndTitleContainingOrContentContainingOrderByEntryDateDesc(
                    userDetails.getId(), search, search);
        } else if (tag != null && !tag.trim().isEmpty()) {
            // Filter by tag
            entries = journalEntryRepository.findByUserIdAndTagsContainingOrderByEntryDateDesc(
                    userDetails.getId(), tag);
        } else if (mood != null && !mood.trim().isEmpty()) {
            // Filter by mood
            entries = journalEntryRepository.findByUserIdAndMoodOrderByEntryDateDesc(
                    userDetails.getId(), mood);
        } else {
            // Get all entries
            entries = journalEntryRepository.findByUserIdOrderByEntryDateDesc(userDetails.getId());
        }

        List<JournalEntryResponse> response = entries.stream()
                .map(JournalEntryResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping({"/journal/{id}", "/api/journal/{id}"})
    public ResponseEntity<?> getJournalEntryById(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        JournalEntry entry = journalEntryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Journal Entry", "id", id));

        // Check if entry belongs to the authenticated user
        if (!entry.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("You don't have permission to view this journal entry"));
        }

        return ResponseEntity.ok(JournalEntryResponse.fromEntity(entry));
    }

    @GetMapping({"/journal/date/{date}", "/api/journal/date/{date}"})
    public ResponseEntity<?> getJournalEntryByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        JournalEntry entry = journalEntryRepository.findByUserIdAndEntryDate(userDetails.getId(), date)
                .orElseThrow(() -> new ResourceNotFoundException("Journal Entry", "date", date));

        return ResponseEntity.ok(JournalEntryResponse.fromEntity(entry));
    }

    @PostMapping({"/journal", "/api/journal"})
    public ResponseEntity<?> createJournalEntry(@Valid @RequestBody JournalEntryRequest request) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();

            // Check if entry already exists for this date
            if (journalEntryRepository.existsByUserIdAndEntryDate(userDetails.getId(), request.getEntryDate())) {
                throw new BadRequestException("A journal entry already exists for this date");
            }

            // Get user
            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userDetails.getId()));

            // Create new journal entry
            JournalEntry entry = new JournalEntry();
            entry.setTitle(request.getTitle());
            entry.setContent(request.getContent());
            entry.setEntryDate(request.getEntryDate());
            entry.setMood(request.getMood());
            entry.setTags(request.getTags());
            entry.setUser(user);

            // Save the entry
            journalEntryRepository.save(entry);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(JournalEntryResponse.fromEntity(entry));

        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Error creating journal entry", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error creating journal entry: " + e.getMessage()));
        }
    }

    @PutMapping({"/journal/{id}", "/api/journal/{id}"})
    public ResponseEntity<?> updateJournalEntry(
            @PathVariable Long id,
            @Valid @RequestBody JournalEntryRequest request) {

        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();

            JournalEntry entry = journalEntryRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Journal Entry", "id", id));

            // Check if entry belongs to the authenticated user
            if (!entry.getUser().getId().equals(userDetails.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("You don't have permission to update this journal entry"));
            }

            // Check if new date conflicts with an existing entry (only if date is changed)
            if (!entry.getEntryDate().equals(request.getEntryDate()) &&
                    journalEntryRepository.existsByUserIdAndEntryDate(userDetails.getId(), request.getEntryDate())) {
                throw new BadRequestException("A journal entry already exists for the new date");
            }

            // Update entry fields
            entry.setTitle(request.getTitle());
            entry.setContent(request.getContent());
            entry.setEntryDate(request.getEntryDate());
            entry.setMood(request.getMood());
            entry.setTags(request.getTags());

            // Save updated entry
            journalEntryRepository.save(entry);

            return ResponseEntity.ok(JournalEntryResponse.fromEntity(entry));

        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Error updating journal entry", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error updating journal entry: " + e.getMessage()));
        }
    }

    @DeleteMapping({"/journal/{id}", "/api/journal/{id}"})
    public ResponseEntity<?> deleteJournalEntry(@PathVariable Long id) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();

            JournalEntry entry = journalEntryRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Journal Entry", "id", id));

            // Check if entry belongs to the authenticated user
            if (!entry.getUser().getId().equals(userDetails.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("You don't have permission to delete this journal entry"));
            }

            // Delete the entry
            journalEntryRepository.delete(entry);

            return ResponseEntity.ok(new MessageResponse("Journal entry deleted successfully"));

        } catch (Exception e) {
            logger.error("Error deleting journal entry", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error deleting journal entry: " + e.getMessage()));
        }
    }

    @GetMapping({"/journal/stats", "/api/journal/stats"})
    public ResponseEntity<?> getJournalStats() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        // Get all entries for the user
        List<JournalEntry> entries = journalEntryRepository.findByUserIdOrderByEntryDateDesc(userDetails.getId());

        // Calculate statistics
        int totalEntries = entries.size();

        // Count entries by mood
        var moodCounts = entries.stream()
                .filter(e -> e.getMood() != null && !e.getMood().isEmpty())
                .collect(Collectors.groupingBy(JournalEntry::getMood, Collectors.counting()));

        // Get most recent entry date
        LocalDate mostRecentDate = entries.isEmpty() ? null :
                entries.get(0).getEntryDate();

        // Calculate streak (consecutive days)
        int streak = calculateStreak(entries);

        // Create response object
        var stats = new Object() {
            public final int total = totalEntries;
            public final Object moods = moodCounts;
            public final LocalDate lastEntryDate = mostRecentDate;
            public final int currentStreak = streak;
        };

        return ResponseEntity.ok(stats);
    }

    private int calculateStreak(List<JournalEntry> entries) {
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
