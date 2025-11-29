package com.example.tour.repository;

import com.example.tour.model.TourSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourScheduleRepository extends JpaRepository<TourSchedule, Long> {

    List<TourSchedule> findByTourIdOrderByDayNumber(Long tourId);

    boolean existsByTourIdAndDayNumber(Long tourId, Integer dayNumber);

    TourSchedule findByTourIdAndDayNumber(Long tourId, Integer dayNumber);
}


