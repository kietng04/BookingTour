package com.example.booking.service;

import com.example.booking.model.Booking;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.util.List;

public interface ExportService {


    ByteArrayInputStream exportBookingsToExcel(List<Booking> bookings);


    ByteArrayInputStream exportDashboardStatsToExcel(LocalDate startDate, LocalDate endDate);
}
