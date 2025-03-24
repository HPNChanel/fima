package org.example.finance_management_system.repository;

import org.example.finance_management_system.model.TransactionTemplate;
import org.example.finance_management_system.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionTemplateRepository extends JpaRepository<TransactionTemplate, Long> {
    List<TransactionTemplate> findByUserOrderByNameAsc(User user);
    boolean existsByIdAndUserId(Long id, Long userId);
}

