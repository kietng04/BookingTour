package com.example.booking.service;

import com.example.booking.dto.dashboard.*;

import java.time.LocalDate;
import java.util.List;

public interface DashboardService {

    /**
     * Get overall dashboard statistics for a date range
     */
    DashboardStatsDTO getDashboardStats(LocalDate startDate, LocalDate endDate);

    /**
     * Get revenue trends by day for a date range
     */
    List<RevenueTrendDTO> getRevenueTrends(LocalDate startDate, LocalDate endDate);

    /**
     * Get top performing tours by revenue
     */
    List<TopTourDTO> getTopTours(int limit);

    /**
     * Get booking distribution by status
     */
    List<BookingStatusStatsDTO> getBookingStatusStats();

    /**
     * Get departure occupancy rates
     */
    List<DepartureOccupancyDTO> getDepartureOccupancy();
}
