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

            // Create header style
            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 12);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            // Header row
            Row headerRow = sheet.createRow(0);
            String[] columns = {"ID", "Tour Name", "User Email", "Departure Date", "Seats", "Total Amount", "Status", "Created At"};

            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data rows
            int rowNum = 1;
            for (Booking booking : bookings) {
                Row row = sheet.createRow(rowNum++);

                // Fetch tour name and user email
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

            // Auto-size columns
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
    public ByteArrayInputStream exportBookingInvoiceToPdf(Long bookingId) {
        log.info("Generating PDF invoice for booking ID: {}", bookingId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);
            document.open();

            // Use Times Roman with CP1258 encoding for Vietnamese support
            // This is a built-in font that supports Vietnamese characters
            BaseFont baseFont = BaseFont.createFont(BaseFont.TIMES_ROMAN, "Cp1258", BaseFont.EMBEDDED);
            com.itextpdf.text.Font titleFont = new com.itextpdf.text.Font(baseFont, 18, com.itextpdf.text.Font.BOLD, BaseColor.BLACK);
            com.itextpdf.text.Font boldFont = new com.itextpdf.text.Font(baseFont, 12, com.itextpdf.text.Font.BOLD, BaseColor.BLACK);
            com.itextpdf.text.Font normalFont = new com.itextpdf.text.Font(baseFont, 11, com.itextpdf.text.Font.NORMAL, BaseColor.BLACK);
            com.itextpdf.text.Font invoiceFont = new com.itextpdf.text.Font(baseFont, 16, com.itextpdf.text.Font.BOLD, BaseColor.BLUE);
            com.itextpdf.text.Font footerFont = new com.itextpdf.text.Font(baseFont, 12, com.itextpdf.text.Font.ITALIC, BaseColor.GRAY);

            // Company Header
            Paragraph title = new Paragraph("BOOKING TOUR VIETNAM", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            document.add(new Paragraph("Địa chỉ: 123 Lê Lợi, Quận 1, TP.HCM", normalFont));
            document.add(new Paragraph("Điện thoại: 1900-xxxx | Email: support@bookingtour.com", normalFont));
            document.add(Chunk.NEWLINE);

            // Invoice Title
            Paragraph invoiceTitle = new Paragraph("HÓA ĐƠN ĐẶT TOUR", invoiceFont);
            invoiceTitle.setAlignment(Element.ALIGN_CENTER);
            document.add(invoiceTitle);
            document.add(Chunk.NEWLINE);

            // Fetch related data
            String tourName = getTourName(booking.getTourId());
            String userEmail = getUserEmail(booking.getUserId());
            String userName = getUserName(booking.getUserId());

            // Booking Details
            document.add(new Paragraph("Mã đơn: #" + booking.getId(), normalFont));
            document.add(new Paragraph("Ngày đặt: " + booking.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")), normalFont));
            document.add(Chunk.NEWLINE);

            document.add(new Paragraph("THÔNG TIN KHÁCH HÀNG", boldFont));
            document.add(new Paragraph("Họ tên: " + userName, normalFont));
            document.add(new Paragraph("Email: " + userEmail, normalFont));
            document.add(Chunk.NEWLINE);

            document.add(new Paragraph("THÔNG TIN TOUR", boldFont));
            document.add(new Paragraph("Tên tour: " + tourName, normalFont));
            document.add(new Paragraph("Mã khởi hành: " + (booking.getDepartureId() != null ?
                booking.getDepartureId().toString() : "N/A"), normalFont));
            document.add(new Paragraph("Số người: " + booking.getNumSeats(), normalFont));
            document.add(Chunk.NEWLINE);

            // Payment Summary Table
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10f);

            PdfPCell cell1 = new PdfPCell(new Phrase("Tổng tiền:", normalFont));
            cell1.setBorder(Rectangle.NO_BORDER);
            table.addCell(cell1);

            PdfPCell cell2 = new PdfPCell(new Phrase(formatCurrency(booking.getTotalAmount()) + " VNĐ", normalFont));
            cell2.setBorder(Rectangle.NO_BORDER);
            cell2.setHorizontalAlignment(Element.ALIGN_RIGHT);
            table.addCell(cell2);

            PdfPCell cell3 = new PdfPCell(new Phrase("Trạng thái thanh toán:", normalFont));
            cell3.setBorder(Rectangle.NO_BORDER);
            table.addCell(cell3);

            PdfPCell cell4 = new PdfPCell(new Phrase(
                booking.getStatus() == Booking.BookingStatus.CONFIRMED ? "Đã thanh toán" : "Chưa thanh toán", normalFont));
            cell4.setBorder(Rectangle.NO_BORDER);
            cell4.setHorizontalAlignment(Element.ALIGN_RIGHT);
            table.addCell(cell4);

            document.add(table);
            document.add(Chunk.NEWLINE);

            Paragraph footer = new Paragraph("Cảm ơn quý khách đã tin tưởng BookingTour!", footerFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            log.info("PDF invoice generated successfully");
            return new ByteArrayInputStream(out.toByteArray());

        } catch (DocumentException | IOException e) {
            log.error("Failed to generate PDF invoice", e);
            throw new RuntimeException("Failed to generate PDF invoice", e);
        }
    }

    @Override
    public ByteArrayInputStream exportDashboardStatsToExcel(LocalDate startDate, LocalDate endDate) {
        log.info("Exporting dashboard stats from {} to {}", startDate, endDate);

        DashboardStatsDTO stats = dashboardService.getDashboardStats(startDate, endDate);
        List<RevenueTrendDTO> trends = dashboardService.getRevenueTrends(startDate, endDate);
        List<TopTourDTO> topTours = dashboardService.getTopTours(10);

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            // Sheet 1: Summary
            Sheet summarySheet = workbook.createSheet("Summary");
            int rowNum = 0;

            // Title
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

            // Revenue Stats
            summarySheet.createRow(rowNum++).createCell(0).setCellValue("REVENUE STATISTICS");
            summarySheet.createRow(rowNum++).createCell(0).setCellValue("Total Revenue: " +
                formatCurrency(stats.getRevenue().getTotal()) + " VNĐ");
            summarySheet.createRow(rowNum++).createCell(0).setCellValue("Confirmed Revenue: " +
                formatCurrency(stats.getRevenue().getConfirmed()) + " VNĐ");
            summarySheet.createRow(rowNum++).createCell(0).setCellValue("Pending Revenue: " +
                formatCurrency(stats.getRevenue().getPending()) + " VNĐ");
            rowNum++;

            // Booking Stats
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

            // Sheet 2: Revenue Trends
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

            // Sheet 3: Top Tours
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

    // Helper methods
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
