package com.example.booking.repository;

import com.example.booking.model.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    Optional<Booking> findById(Long id);
    
    @Query("SELECT b FROM Booking b WHERE b.userId = :userId")
    Page<Booking> findByUserId(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT b FROM Booking b WHERE b.tourId = :tourId")
    List<Booking> findByTourId(@Param("tourId") Long tourId);
    
    @Query("SELECT b FROM Booking b WHERE b.departureId = :departureId")
    List<Booking> findByDepartureId(@Param("departureId") Long departureId);
    
    @Query("SELECT b FROM Booking b WHERE b.status = :status")
    Page<Booking> findByStatus(@Param("status") Booking.BookingStatus status, Pageable pageable);
    
    @Query("SELECT b FROM Booking b WHERE b.userId = :userId AND b.status = :status")
    Page<Booking> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") Booking.BookingStatus status, Pageable pageable);
    
    @Query("SELECT COUNT(b.numSeats) FROM Booking b WHERE b.departureId = :departureId AND b.status IN ('PENDING', 'CONFIRMED')")
    Integer countBookedSeats(@Param("departureId") Long departureId);
}
