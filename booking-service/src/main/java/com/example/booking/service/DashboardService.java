package com.example.booking.service;

import com.example.booking.dto.dashboard.*;

import java.time.LocalDate;
import java.util.List;

public interface DashboardService {


    DashboardStatsDTO getDashboardStats(LocalDate startDate, LocalDate endDate);


    List<RevenueTrendDTO> getRevenueTrends(LocalDate startDate, LocalDate endDate);


    List<TopTourDTO> getTopTours(int limit);


    List<BookingStatusStatsDTO> getBookingStatusStats();


    List<DepartureOccupancyDTO> getDepartureOccupancy();
}
