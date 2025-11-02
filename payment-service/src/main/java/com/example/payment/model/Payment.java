package com.example.payment.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long id;
    
    @Column(name = "booking_id", nullable = false, unique = true)
    private Long bookingId;
    
    @Column(name = "amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private PaymentStatus status;
    
    @Column(name = "payment_method", length = 100)
    private String paymentMethod;
    
    @Column(name = "transaction_id", length = 255, unique = true)
    private String transactionId;
    
    @Column(name = "transaction_date")
    private LocalDateTime transactionDate;
    
    @Column(name = "notes", length = 1000)
    private String notes;

    @Column(name = "momo_order_id", length = 255, unique = true)
    private String momoOrderId;

    @Column(name = "momo_request_id", length = 255, unique = true)
    private String momoRequestId;

    @Column(name = "momo_trans_id")
    private Long momoTransId;

    @Column(name = "momo_payment_method", length = 100)
    private String momoPaymentMethod;

    @Column(name = "momo_response_data", columnDefinition = "text")
    private String momoResponseData;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = PaymentStatus.PENDING;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum PaymentStatus {
        PENDING,
        PROCESSING,
        COMPLETED,
        FAILED,
        REFUNDED
    }
}
