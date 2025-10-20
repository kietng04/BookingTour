package com.example.tour.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public class CreateDepartureRequest {

    private LocalDate startDate;

    private LocalDate endDate;

    @Positive(message = "totalSlots must be greater than 0")
    @Min(value = 1, message = "totalSlots must be at least 1")
    private Integer totalSlots;

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getTotalSlots() {
        return totalSlots;
    }

    public void setTotalSlots(Integer totalSlots) {
        this.totalSlots = totalSlots;
    }
}

