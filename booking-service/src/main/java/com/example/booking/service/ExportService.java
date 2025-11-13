package com.example.booking.service;

import com.example.booking.model.Booking;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.util.List;

public interface ExportService {

    /**
     * Export bookings list to Excel
     * @param bookings List of bookings to export
     * @return Excel file as ByteArrayInputStream
     */
    ByteArrayInputStream exportBookingsToExcel(List<Booking> bookings);

    /**
     * Export booking invoice to PDF
     * @param bookingId Booking ID
     * @return PDF file as ByteArrayInputStream
     */
    ByteArrayInputStream exportBookingInvoiceToPdf(Long bookingId);

    /**
     * Export dashboard statistics to Excel
     * @param startDate Start date for stats
     * @param endDate End date for stats
     * @return Excel file as ByteArrayInputStream
     */
    ByteArrayInputStream exportDashboardStatsToExcel(LocalDate startDate, LocalDate endDate);
}
