package com.example.tour.service;

import com.example.tour.dto.CreateScheduleRequest;
import com.example.tour.model.TourSchedule;

import java.util.List;

public interface ScheduleService {

    /**
     * List all schedules for a tour
     */
    List<TourSchedule> listSchedules(Long tourId);

    /**
     * Add schedule to tour
     * Logic: preserve dayNumber
     */
    TourSchedule addSchedule(Long tourId, CreateScheduleRequest request);

    /**
     * Update schedule
     */
    TourSchedule updateSchedule(Long tourId, Long scheduleId, CreateScheduleRequest request);

    /**
     * Delete schedule
     */
    void deleteSchedule(Long tourId, Long scheduleId);
}

