package org.example.finance_management_system.repository;

import org.example.finance_management_system.model.Transaction;
import org.example.finance_management_system.model.TransactionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface TransactionHistoryRepository extends JpaRepository<TransactionHistory, Long> {
    /**
     * Find transaction history by transaction ID ordered by changed date descending.
     * This method will find history for transactions that still exist.
     */
    List<TransactionHistory> findByTransactionIdOrderByChangedAtDesc(Long transactionId);

    /**
     * Check if history exists for a specific transaction ID.
     */
    boolean existsByTransactionId(Long transactionId);

    /**
     * Delete all history records for a transaction.
     * Not used anymore but kept for backward compatibility.
     */
    @Modifying
    @Transactional
    void deleteByTransactionId(Long transactionId);

    /**
     * Find all deleted transaction history (where transactionId is null)
     */
    @Query("SELECT th FROM TransactionHistory th WHERE th.transactionId IS NULL ORDER BY th.changedAt DESC")
    List<TransactionHistory> findDeletedTransactionHistory();
}



