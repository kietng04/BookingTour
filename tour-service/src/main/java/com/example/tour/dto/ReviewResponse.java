package com.example.tour.dto;

import com.example.tour.model.TourReview;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ReviewResponse {

    private Long id;
    private Long tourId;
    private String tourName;
    private Long userId;
    private Long bookingId;
    private BigDecimal rating;
    private String title;
    private String comment;
    private String guestName;
    private String guestAvatar;
    private String[] badges;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ReviewResponse() {
    }

    public ReviewResponse(TourReview review) {
        this.id = review.getId();
        this.tourId = review.getTour().getId();
        this.tourName = review.getTour().getTourName();
        this.userId = review.getUserId();
        this.bookingId = review.getBookingId();
        this.rating = review.getRating();
        this.title = review.getTitle();
        this.comment = review.getComment();
        this.guestName = review.getGuestName();
        this.guestAvatar = review.getGuestAvatar();
        this.badges = review.getBadges();
        this.status = review.getStatus();
        this.createdAt = review.getCreatedAt();
        this.updatedAt = review.getUpdatedAt();
    }



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getGuestName() {
        return guestName;
    }

    public void setGuestName(String guestName) {
        this.guestName = guestName;
    }

    public String getGuestAvatar() {
        return guestAvatar;
    }

    public void setGuestAvatar(String guestAvatar) {
        this.guestAvatar = guestAvatar;
    }

    public String[] getBadges() {
        return badges;
    }

    public void setBadges(String[] badges) {
        this.badges = badges;
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
