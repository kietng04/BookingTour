package com.example.tour.repository;

import com.example.tour.model.Departure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DepartureRepository extends JpaRepository<Departure, Long> {

    // Find all departures for a tour
    List<Departure> findByTourId(Long tourId);

    // Find departures by tour and status
    List<Departure> findByTourIdAndStatus(Long tourId, Departure.DepartureStatus status);

    // Find upcoming departures (start date after today)
    @Query("SELECT d FROM Departure d WHERE d.tour.id = :tourId AND d.startDate >= :today ORDER BY d.startDate")
    List<Departure> findUpcomingDepartures(@Param("tourId") Long tourId, @Param("today") LocalDate today);

    // Find departures within date range
    @Query("SELECT d FROM Departure d WHERE d.tour.id = :tourId " +
           "AND (:from IS NULL OR d.startDate >= :from) " +
           "AND (:to IS NULL OR d.endDate <= :to) " +
           "AND (:status IS NULL OR d.status = :status)")
    List<Departure> findByTourIdAndFilters(@Param("tourId") Long tourId,
                                            @Param("from") LocalDate from,
                                            @Param("to") LocalDate to,
                                            @Param("status") Departure.DepartureStatus status);
}

