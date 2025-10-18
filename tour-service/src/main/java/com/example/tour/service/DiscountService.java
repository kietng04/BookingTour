package com.example.tour.service;

import com.example.tour.dto.CreateDiscountRequest;
import com.example.tour.model.TourDiscount;

import java.util.List;

public interface DiscountService {

    List<TourDiscount> listDiscounts(Long tourId, boolean activeOnly);

    TourDiscount addDiscount(Long tourId, CreateDiscountRequest request);

    TourDiscount updateDiscount(Long tourId, Long discountId, CreateDiscountRequest request);

    void deleteDiscount(Long tourId, Long discountId);
}

