package org.example.finance_management_system.repository;

import org.example.finance_management_system.model.SpendingGoal;
import org.example.finance_management_system.model.Transaction;
import org.example.finance_management_system.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SpendingGoalRepository extends JpaRepository<SpendingGoal, Long> {

    List<SpendingGoal> findByUser(User user);

    List<SpendingGoal> findByUserOrderByCreatedAtDesc(User user);

    Optional<SpendingGoal> findByUserAndCategoryAndPeriod(User user, Transaction.Category category, SpendingGoal.Period period);

    boolean existsByUserAndCategoryAndPeriod(User user, Transaction.Category category, SpendingGoal.Period period);
}
