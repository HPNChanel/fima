package org.example.finance_management_system.repository;

import org.example.finance_management_system.model.SavingsAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavingsAccountRepository extends JpaRepository<SavingsAccount, Long> {
    List<SavingsAccount> findByUserId(Long userId);

    boolean existsByNameAndUserId(String name, Long userId);
}

