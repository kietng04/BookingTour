package com.example.tour.repository;

import com.example.tour.model.TourLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourLogRepository extends JpaRepository<TourLog, Long> {

    // Find all logs for a tour
    List<TourLog> findByTourIdOrderByChangedAtDesc(Long tourId);
}

