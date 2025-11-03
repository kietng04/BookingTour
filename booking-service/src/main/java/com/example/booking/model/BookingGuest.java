package com.example.booking.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "booking_guests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingGuest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "guest_id")
    private Long id;
    
    @Column(name = "booking_id", nullable = false)
    private Long bookingId;
    
    @Column(name = "guest_name", nullable = false, length = 255)
    private String guestName;
    
    @Column(name = "guest_email", length = 255)
    private String guestEmail;
    
    @Column(name = "guest_phone", length = 20)
    private String guestPhone;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "guest_type", nullable = false, length = 50)
    private GuestType guestType;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (guestType == null) {
            guestType = GuestType.ADULT;
        }
    }
    
    public enum GuestType {
        ADULT,
        CHILD,
        INFANT
    }
}
