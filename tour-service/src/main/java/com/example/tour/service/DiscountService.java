package com.example.tour.service;

import com.example.tour.dto.CreateDiscountRequest;
import com.example.tour.model.TourDiscount;

import java.util.List;

public interface DiscountService {

    /**
     * List all discounts for a tour (optionally only active ones)
     */
    List<TourDiscount> listDiscounts(Long tourId, boolean activeOnly);

    /**
     * Add discount to tour
     */
    TourDiscount addDiscount(Long tourId, CreateDiscountRequest request);

    /**
     * Update discount
     */
    TourDiscount updateDiscount(Long tourId, Long discountId, CreateDiscountRequest request);

    /**
     * Delete discount
     */
    void deleteDiscount(Long tourId, Long discountId);
}

