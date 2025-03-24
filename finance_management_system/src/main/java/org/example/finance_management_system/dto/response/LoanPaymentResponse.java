package org.example.finance_management_system.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Data;
import org.example.finance_management_system.model.LoanPayment;

@Data
public class LoanPaymentResponse {

    private Long id;
    private Integer installmentNumber;
    private LocalDate dueDate;
    private BigDecimal amount;
    private BigDecimal principal;
    private BigDecimal interest;
    private BigDecimal remainingBalance;
    private LoanPayment.PaymentStatus status;
    private LocalDate paymentDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static LoanPaymentResponse fromEntity(LoanPayment payment) {
        LoanPaymentResponse response = new LoanPaymentResponse();
        response.setId(payment.getId());
        response.setInstallmentNumber(payment.getInstallmentNumber());
        response.setDueDate(payment.getDueDate());
        response.setAmount(payment.getAmount());
        response.setPrincipal(payment.getPrincipal());
        response.setInterest(payment.getInterest());
        response.setRemainingBalance(payment.getRemainingBalance());
        response.setStatus(payment.getStatus());
        response.setPaymentDate(payment.getPaymentDate());
        response.setCreatedAt(payment.getCreatedAt());
        response.setUpdatedAt(payment.getUpdatedAt());
        return response;
    }
}
