package com.example.tour.service;

import com.example.tour.dto.CreateScheduleRequest;
import com.example.tour.model.TourSchedule;

import java.util.List;

public interface ScheduleService {

    List<TourSchedule> listSchedules(Long tourId);

    TourSchedule addSchedule(Long tourId, CreateScheduleRequest request);

    TourSchedule updateSchedule(Long tourId, Long scheduleId, CreateScheduleRequest request);

    void deleteSchedule(Long tourId, Long scheduleId);
}

