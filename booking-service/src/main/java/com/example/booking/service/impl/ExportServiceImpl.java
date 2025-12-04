package com.example.booking.service.impl;

import com.example.booking.dto.dashboard.DashboardStatsDTO;
import com.example.booking.dto.dashboard.RevenueTrendDTO;
import com.example.booking.dto.dashboard.TopTourDTO;
import com.example.booking.model.Booking;
import com.example.booking.repository.BookingRepository;
import com.example.booking.service.DashboardService;
import com.example.booking.service.ExportService;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class ExportServiceImpl implements ExportService {

    private static final Logger log = LoggerFactory.getLogger(ExportServiceImpl.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${tour.service.url:http://localhost:8082}")
    private String tourServiceUrl;

    @Value("${user.service.url:http://localhost:8081}")
    private String userServiceUrl;

    @Override
    public ByteArrayInputStream exportBookingsToExcel(List<Booking> bookings) {
        log.info("Exporting {} bookings to Excel", bookings.size());

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Bookings");


            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 12);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);


            Row headerRow = sheet.createRow(0);
            String[] columns = {"ID", "Tour Name", "User Email", "Departure Date", "Seats", "Total Amount", "Status", "Created At"};

            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }


            int rowNum = 1;
            for (Booking booking : bookings) {
                Row row = sheet.createRow(rowNum++);


                String tourName = getTourName(booking.getTourId());
                String userEmail = getUserEmail(booking.getUserId());

                row.createCell(0).setCellValue(booking.getId());
                row.createCell(1).setCellValue(tourName);
                row.createCell(2).setCellValue(userEmail);
                row.createCell(3).setCellValue(booking.getDepartureId() != null ?
                    "Departure ID: " + booking.getDepartureId() : "N/A");
                row.createCell(4).setCellValue(booking.getNumSeats());
                row.createCell(5).setCellValue(booking.getTotalAmount().doubleValue());
                row.createCell(6).setCellValue(booking.getStatus().name());
                row.createCell(7).setCellValue(booking.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
            }


            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            log.info("Excel export completed successfully");
            return new ByteArrayInputStream(out.toByteArray());

        } catch (IOException e) {
            log.error("Failed to export bookings to Excel", e);
            throw new RuntimeException("Failed to export bookings to Excel", e);
        }
    }

    @Override
    public ByteArrayInputStream exportDashboardStatsToExcel(LocalDate startDate, LocalDate endDate) {
        log.info("Exporting dashboard stats from {} to {}", startDate, endDate);

        DashboardStatsDTO stats = dashboardService.getDashboardStats(startDate, endDate);
        List<RevenueTrendDTO> trends = dashboardService.getRevenueTrends(startDate, endDate);
        List<TopTourDTO> topTours = dashboardService.getTopTours(10);

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {


            Sheet summarySheet = workbook.createSheet("Summary");
            int rowNum = 0;


            Row titleRow = summarySheet.createRow(rowNum++);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("DASHBOARD STATISTICS");

            CellStyle titleStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font titleFont = workbook.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 14);
            titleStyle.setFont(titleFont);
            titleCell.setCellStyle(titleStyle);

            summarySheet.createRow(rowNum++).createCell(0).setCellValue("Period: " + startDate + " to " + endDate);
            rowNum++;


            summarySheet.createRow(rowNum++).createCell(0).setCellValue("REVENUE STATISTICS");
            summarySheet.createRow(rowNum++).createCell(0).setCellValue("Total Revenue: " +
                formatCurrency(stats.getRevenue().getTotal()) + " VNĐ");
            summarySheet.createRow(rowNum++).createCell(0).setCellValue("Confirmed Revenue: " +
                formatCurrency(stats.getRevenue().getConfirmed()) + " VNĐ");
            summarySheet.createRow(rowNum++).createCell(0).setCellValue("Pending Revenue: " +
                formatCurrency(stats.getRevenue().getPending()) + " VNĐ");
            rowNum++;


            summarySheet.createRow(rowNum++).createCell(0).setCellValue("BOOKING STATISTICS");
            summarySheet.createRow(rowNum++).createCell(0).setCellValue("Total Bookings: " +
                stats.getBookings().getTotal());
            summarySheet.createRow(rowNum++).createCell(0).setCellValue("Confirmed Bookings: " +
                stats.getBookings().getConfirmed());
            summarySheet.createRow(rowNum++).createCell(0).setCellValue("Pending Bookings: " +
                stats.getBookings().getPending());
            summarySheet.createRow(rowNum++).createCell(0).setCellValue("Cancelled Bookings: " +
                stats.getBookings().getCancelled());

            summarySheet.autoSizeColumn(0);


            Sheet trendsSheet = workbook.createSheet("Revenue Trends");
            Row headerRow = trendsSheet.createRow(0);
            headerRow.createCell(0).setCellValue("Date");
            headerRow.createCell(1).setCellValue("Revenue (VNĐ)");

            int trendRow = 1;
            for (RevenueTrendDTO trend : trends) {
                Row row = trendsSheet.createRow(trendRow++);
                row.createCell(0).setCellValue(trend.getPeriod());
                row.createCell(1).setCellValue(trend.getRevenue().doubleValue());
            }

            trendsSheet.autoSizeColumn(0);
            trendsSheet.autoSizeColumn(1);


            Sheet toursSheet = workbook.createSheet("Top Tours");
            Row tourHeaderRow = toursSheet.createRow(0);
            tourHeaderRow.createCell(0).setCellValue("Tour ID");
            tourHeaderRow.createCell(1).setCellValue("Tour Name");
            tourHeaderRow.createCell(2).setCellValue("Revenue (VNĐ)");
            tourHeaderRow.createCell(3).setCellValue("Booking Count");
            tourHeaderRow.createCell(4).setCellValue("Occupancy Rate (%)");

            int tourRow = 1;
            for (TopTourDTO tour : topTours) {
                Row row = toursSheet.createRow(tourRow++);
                row.createCell(0).setCellValue(tour.getTourId());
                row.createCell(1).setCellValue(tour.getTourName());
                row.createCell(2).setCellValue(tour.getRevenue().doubleValue());
                row.createCell(3).setCellValue(tour.getBookingCount());
                row.createCell(4).setCellValue(tour.getOccupancyRate() != null ? tour.getOccupancyRate() : 0.0);
            }

            for (int i = 0; i < 5; i++) {
                toursSheet.autoSizeColumn(i);
            }

            workbook.write(out);
            log.info("Dashboard stats Excel export completed");
            return new ByteArrayInputStream(out.toByteArray());

        } catch (IOException e) {
            log.error("Failed to export dashboard stats", e);
            throw new RuntimeException("Failed to export dashboard stats", e);
        }
    }


    private String getTourName(Long tourId) {
        try {
            String url = tourServiceUrl + "/tours/" + tourId;
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url, HttpMethod.GET, null, new ParameterizedTypeReference<Map<String, Object>>() {});
            Map<String, Object> tour = response.getBody();
            return tour != null ? (String) tour.get("tourName") : "Unknown Tour";
        } catch (Exception e) {
            log.warn("Failed to fetch tour name for ID: {}", tourId, e);
            return "Tour #" + tourId;
        }
    }

    private String getUserEmail(Long userId) {
        try {
            String url = userServiceUrl + "/users/" + userId;
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url, HttpMethod.GET, null, new ParameterizedTypeReference<Map<String, Object>>() {});
            Map<String, Object> user = response.getBody();
            return user != null ? (String) user.get("email") : "N/A";
        } catch (Exception e) {
            log.warn("Failed to fetch user email for ID: {}", userId, e);
            return "N/A";
        }
    }

    private String getUserName(Long userId) {
        try {
            String url = userServiceUrl + "/users/" + userId;
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url, HttpMethod.GET, null, new ParameterizedTypeReference<Map<String, Object>>() {});
            Map<String, Object> user = response.getBody();
            return user != null ? (String) user.get("fullName") : "Unknown";
        } catch (Exception e) {
            log.warn("Failed to fetch user name for ID: {}", userId, e);
            return "User #" + userId;
        }
    }

    private String formatCurrency(BigDecimal amount) {
        if (amount == null) return "0";
        return String.format("%,d", amount.longValue());
    }
}
