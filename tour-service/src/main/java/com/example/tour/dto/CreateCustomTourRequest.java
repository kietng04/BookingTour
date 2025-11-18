package com.example.tour.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public class CreateCustomTourRequest {

    @NotBlank(message = "Tour name is required")
    private String tourName;

    @NotNull(message = "Number of adults is required")
    @Min(value = 1, message = "Number of adults must be at least 1")
    private Integer numAdult;

    @NotNull(message = "Number of children is required")
    @Min(value = 0, message = "Number of children cannot be negative")
    private Integer numChildren;

    private Long regionId;

    private Long provinceId;

    @NotNull(message = "Start date is required")
    @Future(message = "Start date must be in the future")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    private String description;

    // Getters and Setters
    public String getTourName() {
        return tourName;
    }

    public void setTourName(String tourName) {
        this.tourName = tourName;
    }

    public Integer getNumAdult() {
        return numAdult;
    }

    public void setNumAdult(Integer numAdult) {
        this.numAdult = numAdult;
    }

    public Integer getNumChildren() {
        return numChildren;
    }

    public void setNumChildren(Integer numChildren) {
        this.numChildren = numChildren;
    }

    public Long getRegionId() {
        return regionId;
    }

    public void setRegionId(Long regionId) {
        this.regionId = regionId;
    }

    public Long getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(Long provinceId) {
        this.provinceId = provinceId;
    }

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
