package com.example.tour.service.impl;

import com.example.tour.dto.CreateScheduleRequest;
import com.example.tour.model.Tour;
import com.example.tour.model.TourSchedule;
import com.example.tour.repository.TourRepository;
import com.example.tour.repository.TourScheduleRepository;
import com.example.tour.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScheduleServiceImpl implements ScheduleService {

    @Autowired
    private TourScheduleRepository scheduleRepository;

    @Autowired
    private TourRepository tourRepository;

    @Override
    public List<TourSchedule> listSchedules(Long tourId) {
        // TODO: Verify tour exists
        return scheduleRepository.findByTourIdOrderByDayNumber(tourId);
    }

    @Override
    public TourSchedule addSchedule(Long tourId, CreateScheduleRequest request) {
        // TODO: Preserve dayNumber
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new RuntimeException("Tour not found"));

        TourSchedule schedule = new TourSchedule();
        schedule.setTour(tour);
        schedule.setDayNumber(request.getDayNumber());
        schedule.setScheduleDescription(request.getScheduleDescription());

        return scheduleRepository.save(schedule);
    }

    @Override
    public TourSchedule updateSchedule(Long tourId, Long scheduleId, CreateScheduleRequest request) {
        // TODO: Verify schedule belongs to tour
        TourSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        if (request.getDayNumber() != null) {
            schedule.setDayNumber(request.getDayNumber());
        }
        if (request.getScheduleDescription() != null) {
            schedule.setScheduleDescription(request.getScheduleDescription());
        }

        return scheduleRepository.save(schedule);
    }

    @Override
    public void deleteSchedule(Long tourId, Long scheduleId) {
        // TODO: Verify schedule belongs to tour
        TourSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        scheduleRepository.delete(schedule);
    }
}

