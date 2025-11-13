package com.example.tour.dto;

import com.example.tour.model.CustomTour;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class CustomTourResponse {

    private Long id;
    private Long userId;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer numberOfPeople;
    private String specialRequest;
    private String status;
    private String contactEmail;
    private String contactPhone;
    private String budgetRange;
    private String adminNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructor from entity
    public CustomTourResponse(CustomTour customTour) {
        this.id = customTour.getId();
        this.userId = customTour.getUserId();
        this.destination = customTour.getDestination();
        this.startDate = customTour.getStartDate();
        this.endDate = customTour.getEndDate();
        this.numberOfPeople = customTour.getNumberOfPeople();
        this.specialRequest = customTour.getSpecialRequest();
        this.status = customTour.getStatus().name();
        this.contactEmail = customTour.getContactEmail();
        this.contactPhone = customTour.getContactPhone();
        this.budgetRange = customTour.getBudgetRange();
        this.adminNotes = customTour.getAdminNotes();
        this.createdAt = customTour.getCreatedAt();
        this.updatedAt = customTour.getUpdatedAt();
    }

    // Default constructor
    public CustomTourResponse() {
    }

    // Getters and Setters
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

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
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

    public Integer getNumberOfPeople() {
        return numberOfPeople;
    }

    public void setNumberOfPeople(Integer numberOfPeople) {
        this.numberOfPeople = numberOfPeople;
    }

    public String getSpecialRequest() {
        return specialRequest;
    }

    public void setSpecialRequest(String specialRequest) {
        this.specialRequest = specialRequest;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getBudgetRange() {
        return budgetRange;
    }

    public void setBudgetRange(String budgetRange) {
        this.budgetRange = budgetRange;
    }

    public String getAdminNotes() {
        return adminNotes;
    }

    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
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
