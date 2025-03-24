package org.example.finance_management_system.repository;

import org.example.finance_management_system.model.JournalEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {
    List<JournalEntry> findByUserIdOrderByEntryDateDesc(Long userId);

    List<JournalEntry> findByUserIdAndEntryDateBetweenOrderByEntryDateDesc(
            Long userId, LocalDate startDate, LocalDate endDate);

    Optional<JournalEntry> findByUserIdAndEntryDate(Long userId, LocalDate entryDate);

    List<JournalEntry> findByUserIdAndTitleContainingOrContentContainingOrderByEntryDateDesc(
            Long userId, String titleKeyword, String contentKeyword);

    List<JournalEntry> findByUserIdAndTagsContainingOrderByEntryDateDesc(Long userId, String tag);

    List<JournalEntry> findByUserIdAndMoodOrderByEntryDateDesc(Long userId, String mood);

    boolean existsByUserIdAndEntryDate(Long userId, LocalDate entryDate);
}

