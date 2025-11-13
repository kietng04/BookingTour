package com.example.booking.dto.dashboard;

public class DepartureOccupancyDTO {
    private Long departureId;
    private Long tourId;
    private String tourName;
    private String startDate;
    private Integer totalSlots;
    private Integer bookedSlots;
    private Integer remainingSlots;
    private Double occupancyRate;
    private String status;

    public DepartureOccupancyDTO() {}

    public DepartureOccupancyDTO(Long departureId, Long tourId, String tourName, String startDate,
                                  Integer totalSlots, Integer bookedSlots, Integer remainingSlots,
                                  Double occupancyRate, String status) {
        this.departureId = departureId;
        this.tourId = tourId;
        this.tourName = tourName;
        this.startDate = startDate;
        this.totalSlots = totalSlots;
        this.bookedSlots = bookedSlots;
        this.remainingSlots = remainingSlots;
        this.occupancyRate = occupancyRate;
        this.status = status;
    }

    public Long getDepartureId() {
        return departureId;
    }

    public void setDepartureId(Long departureId) {
        this.departureId = departureId;
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

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public Integer getTotalSlots() {
        return totalSlots;
    }

    public void setTotalSlots(Integer totalSlots) {
        this.totalSlots = totalSlots;
    }

    public Integer getBookedSlots() {
        return bookedSlots;
    }

    public void setBookedSlots(Integer bookedSlots) {
        this.bookedSlots = bookedSlots;
    }

    public Integer getRemainingSlots() {
        return remainingSlots;
    }

    public void setRemainingSlots(Integer remainingSlots) {
        this.remainingSlots = remainingSlots;
    }

    public Double getOccupancyRate() {
        return occupancyRate;
    }

    public void setOccupancyRate(Double occupancyRate) {
        this.occupancyRate = occupancyRate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
