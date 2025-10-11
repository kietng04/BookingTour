package com.example.tour.repository;

import com.example.tour.model.TourSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourScheduleRepository extends JpaRepository<TourSchedule, Long> {

    // Find all schedules for a tour, ordered by day number
    List<TourSchedule> findByTourIdOrderByDayNumber(Long tourId);
}

