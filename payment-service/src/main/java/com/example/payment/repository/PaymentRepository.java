package com.example.payment.repository;

import com.example.payment.model.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    Optional<Payment> findByBookingId(Long bookingId);
    
    @Query("SELECT p FROM Payment p WHERE p.status = :status")
    Page<Payment> findByStatus(@Param("status") Payment.PaymentStatus status, Pageable pageable);
    
    @Query("SELECT p FROM Payment p WHERE p.transactionId = :transactionId")
    Optional<Payment> findByTransactionId(@Param("transactionId") String transactionId);
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = 'COMPLETED'")
    Long countCompletedPayments();
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED'")
    java.math.BigDecimal sumCompletedPaymentAmounts();

    Optional<Payment> findByMomoOrderId(String momoOrderId);

    Optional<Payment> findByMomoRequestId(String momoRequestId);
}
