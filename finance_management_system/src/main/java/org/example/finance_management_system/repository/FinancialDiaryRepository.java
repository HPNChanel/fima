package org.example.finance_management_system.repository;

import org.example.finance_management_system.model.FinancialDiaryEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FinancialDiaryRepository extends JpaRepository<FinancialDiaryEntry, Long> {
    List<FinancialDiaryEntry> findByUserIdOrderByEntryDateDesc(Long userId);

    List<FinancialDiaryEntry> findByUserIdAndEntryDateBetweenOrderByEntryDateDesc(
            Long userId, LocalDate startDate, LocalDate endDate);

    Optional<FinancialDiaryEntry> findByUserIdAndEntryDate(Long userId, LocalDate entryDate);

    List<FinancialDiaryEntry> findByUserIdAndTitleContainingOrContentContainingOrderByEntryDateDesc(
            Long userId, String titleKeyword, String contentKeyword);

    List<FinancialDiaryEntry> findByUserIdAndTagsContainingOrderByEntryDateDesc(Long userId, String tag);

    List<FinancialDiaryEntry> findByUserIdAndFinancialGoalContainingOrderByEntryDateDesc(Long userId, String goal);

    boolean existsByUserIdAndEntryDate(Long userId, LocalDate entryDate);
}
