package com.example.booking.dto.dashboard;

import java.math.BigDecimal;

public class TopTourDTO {
    private Long tourId;
    private String tourName;
    private BigDecimal revenue;
    private Long bookingCount;
    private Double occupancyRate;

    public TopTourDTO() {}

    public TopTourDTO(Long tourId, String tourName, BigDecimal revenue, Long bookingCount, Double occupancyRate) {
        this.tourId = tourId;
        this.tourName = tourName;
        this.revenue = revenue;
        this.bookingCount = bookingCount;
        this.occupancyRate = occupancyRate;
    }

    public Long getTourId() {
        return tourId;
    }

    public void setTourId(Long tourId) {
        this.tourId = tourId;
    }

    public String getTourName() {
        return tourName;
    }

    public void setTourName(String tourName) {
        this.tourName = tourName;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }

    public Long getBookingCount() {
        return bookingCount;
    }

    public void setBookingCount(Long bookingCount) {
        this.bookingCount = bookingCount;
    }

    public Double getOccupancyRate() {
        return occupancyRate;
    }

    public void setOccupancyRate(Double occupancyRate) {
        this.occupancyRate = occupancyRate;
    }
}
