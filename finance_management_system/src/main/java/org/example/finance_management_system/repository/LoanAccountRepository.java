package org.example.finance_management_system.repository;

import java.util.List;

import org.example.finance_management_system.model.LoanAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoanAccountRepository extends JpaRepository<LoanAccount, Long> {
    List<LoanAccount> findByUserId(Long userId);
    boolean existsByNameAndUserId(String name, Long userId);
    List<LoanAccount> findByStatus(LoanAccount.LoanStatus status);
}
