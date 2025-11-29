package com.example.tour.dto;

import com.example.tour.model.CustomTour;
import jakarta.validation.constraints.NotNull;

public class UpdateCustomTourStatusRequest {

    @NotNull(message = "Status is required")
    private CustomTour.CustomTourStatus status;

    private String adminNotes;


    public CustomTour.CustomTourStatus getStatus() {
        return status;
    }

    public void setStatus(CustomTour.CustomTourStatus status) {
        this.status = status;
    }

    public String getAdminNotes() {
        return adminNotes;
    }

    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }
}
