package com.example.booking.repository;

import com.example.booking.model.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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



    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.status = :status AND b.createdAt BETWEEN :startDate AND :endDate")
    BigDecimal sumRevenueByStatusAndDateRange(@Param("status") Booking.BookingStatus status,
                                               @Param("startDate") LocalDateTime startDate,
                                               @Param("endDate") LocalDateTime endDate);


    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.createdAt BETWEEN :startDate AND :endDate")
    BigDecimal sumRevenueByDateRange(@Param("startDate") LocalDateTime startDate,
                                      @Param("endDate") LocalDateTime endDate);


    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = :status")
    Long countByStatus(@Param("status") Booking.BookingStatus status);


    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = :status AND b.createdAt BETWEEN :startDate AND :endDate")
    Long countByStatusAndDateRange(@Param("status") Booking.BookingStatus status,
                                    @Param("startDate") LocalDateTime startDate,
                                    @Param("endDate") LocalDateTime endDate);


    @Query("SELECT COUNT(b) FROM Booking b WHERE b.createdAt BETWEEN :startDate AND :endDate")
    Long countByDateRange(@Param("startDate") LocalDateTime startDate,
                           @Param("endDate") LocalDateTime endDate);


    @Query("SELECT b.tourId, COALESCE(SUM(b.totalAmount), 0), COUNT(b) " +
           "FROM Booking b WHERE b.status = 'CONFIRMED' " +
           "GROUP BY b.tourId " +
           "ORDER BY SUM(b.totalAmount) DESC")
    List<Object[]> findTopToursByRevenue(Pageable pageable);


    @Query("SELECT CAST(b.createdAt AS date), COALESCE(SUM(b.totalAmount), 0) " +
           "FROM Booking b " +
           "WHERE b.status = 'CONFIRMED' AND b.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY CAST(b.createdAt AS date) " +
           "ORDER BY CAST(b.createdAt AS date)")
    List<Object[]> getRevenueTrendsByDay(@Param("startDate") LocalDateTime startDate,
                                          @Param("endDate") LocalDateTime endDate);


    @Query("SELECT COUNT(DISTINCT b.userId) FROM Booking b WHERE b.createdAt BETWEEN :startDate AND :endDate")
    Long countDistinctUsersByDateRange(@Param("startDate") LocalDateTime startDate,
                                        @Param("endDate") LocalDateTime endDate);


    @Query("SELECT b.status, COUNT(b) FROM Booking b GROUP BY b.status")
    List<Object[]> countByStatusGrouped();
}
