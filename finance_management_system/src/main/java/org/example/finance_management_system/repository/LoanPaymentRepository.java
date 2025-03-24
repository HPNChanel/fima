package org.example.finance_management_system.repository;

import java.util.List;
import java.util.Optional;

import org.example.finance_management_system.model.LoanAccount;
import org.example.finance_management_system.model.LoanPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoanPaymentRepository extends JpaRepository<LoanPayment, Long> {
    List<LoanPayment> findByLoanAccountIdOrderByInstallmentNumber(Long loanAccountId);
    Optional<LoanPayment> findByLoanAccountIdAndInstallmentNumber(Long loanAccountId, Integer installmentNumber);
}
