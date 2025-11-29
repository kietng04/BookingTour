package com.example.booking.service.impl;

import com.example.booking.dto.dashboard.*;
import com.example.booking.dto.dashboard.DashboardStatsDTO.*;
import com.example.booking.model.Booking;
import com.example.booking.repository.BookingRepository;
import com.example.booking.service.DashboardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    private static final Logger log = LoggerFactory.getLogger(DashboardServiceImpl.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${tour.service.url:http://localhost:8082}")
    private String tourServiceUrl;

    @Override
    public DashboardStatsDTO getDashboardStats(LocalDate startDate, LocalDate endDate) {
        log.info("Fetching dashboard stats from {} to {}", startDate, endDate);

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

        BigDecimal totalRevenue = bookingRepository.sumRevenueByDateRange(startDateTime, endDateTime);
        BigDecimal confirmedRevenue = bookingRepository.sumRevenueByStatusAndDateRange(
                Booking.BookingStatus.CONFIRMED, startDateTime, endDateTime);
        BigDecimal pendingRevenue = bookingRepository.sumRevenueByStatusAndDateRange(
                Booking.BookingStatus.PENDING, startDateTime, endDateTime);

        long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate);
        LocalDate prevStartDate = startDate.minusDays(daysBetween);
        LocalDate prevEndDate = startDate.minusDays(1);
        BigDecimal prevRevenue = bookingRepository.sumRevenueByDateRange(
                prevStartDate.atStartOfDay(), prevEndDate.atTime(LocalTime.MAX));
        Double revenueChange = calculatePercentageChange(confirmedRevenue, prevRevenue);

        RevenueStats revenueStats = new RevenueStats(totalRevenue, confirmedRevenue, pendingRevenue, revenueChange);

        Long totalBookings = bookingRepository.countByDateRange(startDateTime, endDateTime);
        Long confirmedBookings = bookingRepository.countByStatusAndDateRange(
                Booking.BookingStatus.CONFIRMED, startDateTime, endDateTime);
        Long pendingBookings = bookingRepository.countByStatusAndDateRange(
                Booking.BookingStatus.PENDING, startDateTime, endDateTime);
        Long cancelledBookings = bookingRepository.countByStatusAndDateRange(
                Booking.BookingStatus.CANCELLED, startDateTime, endDateTime);

        Double conversionRate = totalBookings > 0
                ? (confirmedBookings * 100.0) / totalBookings
                : 0.0;

        BookingStats bookingStats = new BookingStats(
                totalBookings, confirmedBookings, pendingBookings, cancelledBookings, conversionRate);

        Long activeUsers = bookingRepository.countDistinctUsersByDateRange(startDateTime, endDateTime);
        Long totalUsers = getTotalUsersFromUserService();
        Long newUsers = getNewUsersByDateRange(startDate, endDate);

        UserStats userStats = new UserStats(totalUsers, newUsers, activeUsers);

        return new DashboardStatsDTO(revenueStats, bookingStats, userStats);
    }

    @Override
    public List<RevenueTrendDTO> getRevenueTrends(LocalDate startDate, LocalDate endDate) {
        log.info("Fetching revenue trends from {} to {}", startDate, endDate);

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

        List<Object[]> trends = bookingRepository.getRevenueTrendsByDay(startDateTime, endDateTime);

        return trends.stream()
                .map(row -> {
                    Date sqlDate = (Date) row[0];
                    BigDecimal revenue = (BigDecimal) row[1];
                    String period = sqlDate.toLocalDate().format(DATE_FORMATTER);
                    return new RevenueTrendDTO(period, revenue);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<TopTourDTO> getTopTours(int limit) {
        log.info("Fetching top {} tours by revenue", limit);

        List<Object[]> topToursData = bookingRepository.findTopToursByRevenue(
                PageRequest.of(0, limit));

        return topToursData.stream()
                .map(row -> {
                    Long tourId = ((Number) row[0]).longValue();
                    BigDecimal revenue = (BigDecimal) row[1];
                    Long bookingCount = ((Number) row[2]).longValue();

                    String tourName = getTourNameFromTourService(tourId);

                    Double occupancyRate = calculateTourOccupancyRate(tourId);

                    return new TopTourDTO(tourId, tourName, revenue, bookingCount, occupancyRate);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingStatusStatsDTO> getBookingStatusStats() {
        log.info("Fetching booking status statistics");

        List<Object[]> statusCounts = bookingRepository.countByStatusGrouped();
        Long totalBookings = statusCounts.stream()
                .mapToLong(row -> ((Number) row[1]).longValue())
                .sum();

        return statusCounts.stream()
                .map(row -> {
                    Booking.BookingStatus status = (Booking.BookingStatus) row[0];
                    Long count = ((Number) row[1]).longValue();
                    Double percentage = totalBookings > 0
                            ? (count * 100.0) / totalBookings
                            : 0.0;
                    return new BookingStatusStatsDTO(status.name(), count, percentage);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<DepartureOccupancyDTO> getDepartureOccupancy() {
        log.info("Fetching departure occupancy rates");

        try {
            String url = tourServiceUrl + "/tours";
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {});

            List<Map<String, Object>> tours = response.getBody();
            if (tours == null) {
                return Collections.emptyList();
            }

            List<DepartureOccupancyDTO> occupancyList = new ArrayList<>();

            for (Map<String, Object> tour : tours) {
                Long tourId = ((Number) tour.get("id")).longValue();
                String tourName = (String) tour.get("tourName");

                List<Map<String, Object>> departures = getDeparturesFromTourService(tourId);

                for (Map<String, Object> dep : departures) {
                    Long departureId = ((Number) dep.get("id")).longValue();
                    String startDate = (String) dep.get("startDate");
                    Integer totalSlots = (Integer) dep.get("totalSlots");
                    Integer remainingSlots = (Integer) dep.get("remainingSlots");

                    Integer bookedSlots = totalSlots - remainingSlots;
                    Double occupancyRate = totalSlots > 0
                            ? (bookedSlots * 100.0) / totalSlots
                            : 0.0;

                    String status = remainingSlots == 0 ? "FULL" :
                            occupancyRate > 80 ? "NEARLY_FULL" : "AVAILABLE";

                    occupancyList.add(new DepartureOccupancyDTO(
                            departureId, tourId, tourName, startDate,
                            totalSlots, bookedSlots, remainingSlots,
                            occupancyRate, status
                    ));
                }
            }

            return occupancyList.stream()
                    .sorted(Comparator.comparing(DepartureOccupancyDTO::getOccupancyRate).reversed())
                    .limit(10)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Failed to fetch departure occupancy from tour-service", e);
            return Collections.emptyList();
        }
    }


    private Double calculatePercentageChange(BigDecimal current, BigDecimal previous) {
        if (previous == null || previous.compareTo(BigDecimal.ZERO) == 0) {
            return current.compareTo(BigDecimal.ZERO) > 0 ? 100.0 : 0.0;
        }
        BigDecimal change = current.subtract(previous);
        BigDecimal percentChange = change.multiply(BigDecimal.valueOf(100))
                .divide(previous, 2, RoundingMode.HALF_UP);
        return percentChange.doubleValue();
    }

    private String getTourNameFromTourService(Long tourId) {
        try {
            String url = tourServiceUrl + "/tours/" + tourId;
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Object>>() {});

            Map<String, Object> tour = response.getBody();
            return tour != null ? (String) tour.get("tourName") : "Unknown Tour";
        } catch (Exception e) {
            log.warn("Failed to fetch tour name for tourId: {}", tourId, e);
            return "Tour #" + tourId;
        }
    }

    private Double calculateTourOccupancyRate(Long tourId) {
        return 0.0;
    }

    private List<Map<String, Object>> getDeparturesFromTourService(Long tourId) {
        try {
            String url = tourServiceUrl + "/tours/" + tourId + "/departures";
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {});

            return response.getBody() != null ? response.getBody() : Collections.emptyList();
        } catch (Exception e) {
            log.warn("Failed to fetch departures for tourId: {}", tourId, e);
            return Collections.emptyList();
        }
    }

    private Long getTotalUsersFromUserService() {
        try {
            String url = "http://user-service:8081/users/count";
            ResponseEntity<Long> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Long>() {});
            return response.getBody() != null ? response.getBody() : 0L;
        } catch (Exception e) {
            log.warn("Failed to fetch total users from user-service", e);
            return 0L;
        }
    }

    private Long getNewUsersByDateRange(LocalDate startDate, LocalDate endDate) {
        try {
            String url = String.format("http://user-service:8081/users/count/new?startDate=%s&endDate=%s",
                    startDate.format(DATE_FORMATTER), endDate.format(DATE_FORMATTER));
            ResponseEntity<Long> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Long>() {});
            return response.getBody() != null ? response.getBody() : 0L;
        } catch (Exception e) {
            log.warn("Failed to fetch new users count from user-service", e);
            return 0L;
        }
    }
}
