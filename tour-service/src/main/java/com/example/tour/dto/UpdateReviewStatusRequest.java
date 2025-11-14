package com.example.tour.dto;

public class UpdateReviewStatusRequest {

    private String status;

    public UpdateReviewStatusRequest() {
    }

    public UpdateReviewStatusRequest(String status) {
        this.status = status;
    }

    // Getters and Setters

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
