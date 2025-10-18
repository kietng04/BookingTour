package com.example.tour.controller;

import com.example.tour.dto.CreateScheduleRequest;
import com.example.tour.dto.UpdateScheduleRequest;
import com.example.tour.model.TourSchedule;
import com.example.tour.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tours/{tourId}/schedules")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    /**
     * GET /tours/{tourId}/schedules
     * List all schedules for a tour
     */
    @GetMapping
    public ResponseEntity<List<TourSchedule>> listSchedules(@PathVariable Long tourId) {
        List<TourSchedule> schedules = scheduleService.listSchedules(tourId);
        return ResponseEntity.ok(schedules);
    }

    /**
     * POST /tours/{tourId}/schedules [ADMIN]
     * Add schedule to tour
     */
    @PostMapping
    public ResponseEntity<TourSchedule> addSchedule(
            @PathVariable Long tourId,
            @RequestBody CreateScheduleRequest request) {

        TourSchedule schedule = scheduleService.addSchedule(tourId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(schedule);
    }

    /**
     * PUT /tours/{tourId}/schedules/{scheduleId} [ADMIN]
     * Update schedule
     */
    @PutMapping("/{scheduleId}")
    public ResponseEntity<TourSchedule> updateSchedule(
            @PathVariable Long tourId,
            @PathVariable Long scheduleId,
            @RequestBody UpdateScheduleRequest request) {
            
        TourSchedule schedule = scheduleService.updateSchedule(tourId, scheduleId, request);
        return ResponseEntity.ok(schedule);
    }

    /**
     * DELETE /tours/{tourId}/schedules/{scheduleId} [ADMIN]
     * Delete schedule
     */
    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<Void> deleteSchedule(
            @PathVariable Long tourId,
            @PathVariable Long scheduleId) {
            
        scheduleService.deleteSchedule(tourId, scheduleId);
        return ResponseEntity.ok().build();
    }
}