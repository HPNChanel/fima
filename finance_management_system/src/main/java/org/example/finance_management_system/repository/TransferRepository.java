package org.example.finance_management_system.repository;

import org.example.finance_management_system.model.Account;
import org.example.finance_management_system.model.Transfer;
import org.example.finance_management_system.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransferRepository extends JpaRepository<Transfer, Long> {
    List<Transfer> findByUser(User user);
    List<Transfer> findBySourceAccount(Account account);
    List<Transfer> findByDestinationAccount(Account account);
    // Add the missing methods
    List<Transfer> findByUserOrderByDateDesc(User user);

    @Query("SELECT t FROM Transfer t WHERE t.sourceAccount.id = :accountId OR t.destinationAccount.id = :accountId ORDER BY t.date DESC")
    List<Transfer> findBySourceAccountIdOrDestinationAccountId(@Param("accountId") Long accountId);

    // Add method to find transfers by user ID ordered by date
    @Query("SELECT t FROM Transfer t WHERE t.user.id = :userId ORDER BY t.date DESC")
    List<Transfer> findByUserIdOrderByDateDesc(@Param("userId") Long userId);

    // Make sure this method exists for checking transfers before account deletion
    List<Transfer> findBySourceAccountOrDestinationAccount(Account sourceAccount, Account destinationAccount);
}



