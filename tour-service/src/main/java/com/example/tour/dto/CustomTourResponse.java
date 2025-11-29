package com.example.tour.dto;

import com.example.tour.model.CustomTour;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class CustomTourResponse {

    private Long id;
    private Long userId;
    private String tourName;
    private Integer numAdult;
    private Integer numChildren;
    private Long regionId;
    private Long provinceId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    public CustomTourResponse(CustomTour customTour) {
        this.id = customTour.getId();
        this.userId = customTour.getUserId();
        this.tourName = customTour.getTourName();
        this.numAdult = customTour.getNumAdult();
        this.numChildren = customTour.getNumChildren();
        this.regionId = customTour.getRegionId();
        this.provinceId = customTour.getProvinceId();
        this.startDate = customTour.getStartDate();
        this.endDate = customTour.getEndDate();
        this.description = customTour.getDescription();
        this.status = customTour.getStatus().name();
        this.createdAt = customTour.getCreatedAt();
        this.updatedAt = customTour.getUpdatedAt();
    }


    public CustomTourResponse() {
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
