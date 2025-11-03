package com.example.booking.repository;

import com.example.booking.model.BookingGuest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingGuestRepository extends JpaRepository<BookingGuest, Long> {
    
    @Query("SELECT bg FROM BookingGuest bg WHERE bg.bookingId = :bookingId")
    List<BookingGuest> findByBookingId(@Param("bookingId") Long bookingId);
    
    @Query("SELECT COUNT(bg) FROM BookingGuest bg WHERE bg.bookingId = :bookingId")
    Integer countByBookingId(@Param("bookingId") Long bookingId);
    
    @Query("DELETE FROM BookingGuest bg WHERE bg.bookingId = :bookingId")
    void deleteByBookingId(@Param("bookingId") Long bookingId);
}
