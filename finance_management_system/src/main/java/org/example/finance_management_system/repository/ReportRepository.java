package org.example.finance_management_system.repository;

import org.example.finance_management_system.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByUserId(Long userId);

    List<Report> findByUserIdAndType(Long userId, Report.ReportType type);

    List<Report> findByUserIdAndFromDateGreaterThanEqualAndToDateLessThanEqual(
            Long userId, LocalDate startDate, LocalDate endDate);
}

