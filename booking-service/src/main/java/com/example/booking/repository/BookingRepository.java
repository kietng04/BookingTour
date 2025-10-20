package com.example.booking.repository;

import com.example.booking.model.Booking;
import com.example.booking.model.Booking.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    Page<Booking> findByUserId(Long userId, Pageable pageable);

    Page<Booking> findByStatus(BookingStatus status, Pageable pageable);

    List<Booking> findByDepartureId(Long departureId);

    Page<Booking> findByDepartureId(Long departureId, Pageable pageable);

    List<Booking> findByUserIdAndStatus(Long userId, BookingStatus status);
}

