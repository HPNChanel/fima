package org.example.finance_management_system.repository;

import org.example.finance_management_system.model.Account;
import org.example.finance_management_system.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByUserId(Long userId);

    // Add this method to find accounts by User entity
    List<Account> findByUser(User user);

    boolean existsByNameAndUserId(String name, Long userId);
    List<Account> findByUserIdAndType(Long userId, Account.AccountType type);
}