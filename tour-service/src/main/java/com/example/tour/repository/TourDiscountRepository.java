package com.example.tour.repository;

import com.example.tour.model.TourDiscount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TourDiscountRepository extends JpaRepository<TourDiscount, Long> {

    // Find all discounts for a tour
    List<TourDiscount> findByTourId(Long tourId);

    // Find active discounts (current date within range)
    @Query("SELECT d FROM TourDiscount d WHERE d.tour.id = :tourId " +
           "AND d.startDate <= :today AND d.endDate >= :today")
    List<TourDiscount> findActiveTourDiscounts(@Param("tourId") Long tourId, @Param("today") LocalDate today);
}

