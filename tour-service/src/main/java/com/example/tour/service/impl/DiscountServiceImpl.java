package com.example.tour.service.impl;

import com.example.tour.dto.CreateDiscountRequest;
import com.example.tour.model.Tour;
import com.example.tour.model.TourDiscount;
import com.example.tour.repository.TourDiscountRepository;
import com.example.tour.repository.TourRepository;
import com.example.tour.service.DiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DiscountServiceImpl implements DiscountService {

    @Autowired
    private TourDiscountRepository discountRepository;

    @Autowired
    private TourRepository tourRepository;

    @Override
    public List<TourDiscount> listDiscounts(Long tourId, boolean activeOnly) {
        // TODO: Implement listActive with dateNow
        if (activeOnly) {
            return discountRepository.findActiveTourDiscounts(tourId, LocalDate.now());
        }
        return discountRepository.findByTourId(tourId);
    }

    @Override
    public TourDiscount addDiscount(Long tourId, CreateDiscountRequest request) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new RuntimeException("Tour not found"));

        TourDiscount discount = new TourDiscount();
        discount.setTour(tour);
        discount.setDiscountName(request.getDiscountName());
        discount.setDiscountType(TourDiscount.DiscountType.valueOf(request.getDiscountType()));
        discount.setDiscountValue(request.getDiscountValue());
        discount.setStartDate(request.getStartDate());
        discount.setEndDate(request.getEndDate());

        return discountRepository.save(discount);
    }

    @Override
    public TourDiscount updateDiscount(Long tourId, Long discountId, CreateDiscountRequest request) {
        // TODO: Verify discount belongs to tour
        TourDiscount discount = discountRepository.findById(discountId)
                .orElseThrow(() -> new RuntimeException("Discount not found"));

        if (request.getDiscountName() != null) {
            discount.setDiscountName(request.getDiscountName());
        }
        if (request.getDiscountType() != null) {
            discount.setDiscountType(TourDiscount.DiscountType.valueOf(request.getDiscountType()));
        }
        if (request.getDiscountValue() != null) {
            discount.setDiscountValue(request.getDiscountValue());
        }
        if (request.getStartDate() != null) {
            discount.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            discount.setEndDate(request.getEndDate());
        }

        return discountRepository.save(discount);
    }

    @Override
    public void deleteDiscount(Long tourId, Long discountId) {
        // TODO: Verify discount belongs to tour
        TourDiscount discount = discountRepository.findById(discountId)
                .orElseThrow(() -> new RuntimeException("Discount not found"));
        discountRepository.delete(discount);
    }
}

