package com.example.tour.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.Map;

public class ReviewSummaryResponse {

    private Long totalReviews;
    private BigDecimal averageRating;

    @JsonProperty("distribution")
    private Map<Integer, Long> ratingDistribution;

    public ReviewSummaryResponse() {
    }

    public ReviewSummaryResponse(Long totalReviews, BigDecimal averageRating, Map<Integer, Long> ratingDistribution) {
        this.totalReviews = totalReviews;
        this.averageRating = averageRating;
        this.ratingDistribution = ratingDistribution;
    }



    public Long getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(Long totalReviews) {
        this.totalReviews = totalReviews;
    }

    public BigDecimal getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(BigDecimal averageRating) {
        this.averageRating = averageRating;
    }

    public Map<Integer, Long> getRatingDistribution() {
        return ratingDistribution;
    }

    public void setRatingDistribution(Map<Integer, Long> ratingDistribution) {
        this.ratingDistribution = ratingDistribution;
    }
}
