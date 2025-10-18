package com.example.tour.repository;

import com.example.tour.model.TourSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourScheduleRepository extends JpaRepository<TourSchedule, Long> {

    // Tìm lịch trình tour, sort theo ngày
    List<TourSchedule> findByTourIdOrderByDayNumber(Long tourId);
    
    // Ktra tồn tại lịch trình tour với ngày cụ thể
    boolean existsByTourIdAndDayNumber(Long tourId, Integer dayNumber);
    
    // Find lịch trình tour với ngày cụ thể
    TourSchedule findByTourIdAndDayNumber(Long tourId, Integer dayNumber);
}

