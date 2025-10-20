package com.example.tour.service.impl;

import com.example.tour.dto.CreateScheduleRequest;
import com.example.tour.dto.UpdateScheduleRequest;
import com.example.tour.model.Tour;
import com.example.tour.model.TourSchedule;
import com.example.tour.repository.TourRepository;
import com.example.tour.repository.TourScheduleRepository;
import com.example.tour.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ScheduleServiceImpl implements ScheduleService {

    @Autowired
    private TourScheduleRepository scheduleRepository;

    @Autowired
    private TourRepository tourRepository;

    @Override
    public List<TourSchedule> listSchedules(Long tourId) {
        if (!tourRepository.existsById(tourId)) 
            throw new RuntimeException("Không tìm thấy tour với id = " + tourId);
        
        return scheduleRepository.findByTourIdOrderByDayNumber(tourId);
    }

    @Override
    @Transactional
    public TourSchedule addSchedule(Long tourId, CreateScheduleRequest request) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tour với id = " + tourId));

        validateSchedule(request, tour.getDays());

        if (scheduleRepository.existsByTourIdAndDayNumber(tourId, request.getDayNumber())) 
            throw new IllegalArgumentException("Ngày " + request.getDayNumber() + " đã có lịch trình trong tour này");
        
        TourSchedule schedule = new TourSchedule();
        schedule.setTour(tour);
        schedule.setDayNumber(request.getDayNumber());
        schedule.setScheduleDescription(request.getScheduleDescription().trim());

        return scheduleRepository.save(schedule);
    }

    @Override
    @Transactional
    public TourSchedule updateSchedule(Long tourId, Long scheduleId, UpdateScheduleRequest request) {
        TourSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch trình với id = " + scheduleId));

        if (request.getDayNumber() != null || request.getScheduleDescription() != null) {
            Tour tour = tourRepository.findById(tourId).orElseThrow();
            validateUpdateSchedule(request, tour.getDays());
        }

        if (request.getDayNumber() != null && !request.getDayNumber().equals(schedule.getDayNumber()))
            if (scheduleRepository.existsByTourIdAndDayNumber(tourId, request.getDayNumber()))
                throw new IllegalArgumentException("Ngày " + request.getDayNumber() + " đã có lịch trình trong tour này");

        schedule.setDayNumber(request.getDayNumber());
        schedule.setScheduleDescription(request.getScheduleDescription().trim());
        
        return scheduleRepository.save(schedule);
    }

    @Override
    @Transactional
    public void deleteSchedule(Long tourId, Long scheduleId) {
        TourSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch trình với id = " + scheduleId));

        scheduleRepository.delete(schedule);
    }


    private void validateSchedule(CreateScheduleRequest request, Integer totalDays) {
        if (request.getDayNumber() == null || request.getDayNumber() <= 0)
            throw new IllegalArgumentException("Số ngày phải là số nguyên dương");

        if (request.getDayNumber() > totalDays) 
            throw new IllegalArgumentException("Số ngày không được vượt quá tổng số ngày của tour (" + totalDays + ")");

        if (request.getScheduleDescription() == null || request.getScheduleDescription().isBlank())
            throw new IllegalArgumentException("Mô tả lịch trình không được để trống");
        
        if (request.getScheduleDescription().trim().length() < 10) 
            throw new IllegalArgumentException("Mô tả lịch trình phải có ít nhất 10 ký tự");
        
        if (request.getScheduleDescription().trim().length() > 2000) 
            throw new IllegalArgumentException("Mô tả lịch trình không được vượt quá 2000 ký tự");
    }


    private void validateUpdateSchedule(UpdateScheduleRequest request, Integer totalDays) {
        if (request.getDayNumber() != null) {
            if (request.getDayNumber() <= 0) 
                throw new IllegalArgumentException("Số ngày phải là số nguyên dương");
            
            if (request.getDayNumber() > totalDays) 
                throw new IllegalArgumentException("Số ngày không được vượt quá tổng số ngày của tour (" + totalDays + ")");
            
        }

        if (request.getScheduleDescription() != null) {
            if (request.getScheduleDescription().isBlank()) 
                throw new IllegalArgumentException("Mô tả lịch trình không được để trống");
            
            if (request.getScheduleDescription().trim().length() < 10) 
                throw new IllegalArgumentException("Mô tả lịch trình phải có ít nhất 10 ký tự");
               
            if (request.getScheduleDescription().trim().length() > 2000) 
                throw new IllegalArgumentException("Mô tả lịch trình không được vượt quá 200 ký tự");
        }
        
    }
}


