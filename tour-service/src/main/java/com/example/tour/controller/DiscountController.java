package com.example.tour.controller;

import com.example.tour.dto.CreateDiscountRequest;
import com.example.tour.model.TourDiscount;
import com.example.tour.service.DiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tours/{tourId}/discounts")
public class DiscountController {

    @Autowired
    private DiscountService discountService;

    /**
     * GET /tours/{tourId}/discounts?activeOnly=true|false
     * List discounts for a tour
     */
    @GetMapping
    public ResponseEntity<List<TourDiscount>> listDiscounts(@PathVariable Long tourId,
                                                             @RequestParam(defaultValue = "false") boolean activeOnly) {
        List<TourDiscount> discounts = discountService.listDiscounts(tourId, activeOnly);
        return ResponseEntity.ok(discounts);
    }

    /**
     * POST /tours/{tourId}/discounts [ADMIN]
     * Add discount to tour
     */
    @PostMapping
    public ResponseEntity<TourDiscount> addDiscount(@PathVariable Long tourId,
                                                     @RequestBody CreateDiscountRequest request) {
        TourDiscount discount = discountService.addDiscount(tourId, request);
        return ResponseEntity.ok(discount);
    }

    /**
     * PUT /tours/{tourId}/discounts/{discountId} [ADMIN]
     * Update discount
     */
    @PutMapping("/{discountId}")
    public ResponseEntity<TourDiscount> updateDiscount(@PathVariable Long tourId,
                                                        @PathVariable Long discountId,
                                                        @RequestBody CreateDiscountRequest request) {
        TourDiscount discount = discountService.updateDiscount(tourId, discountId, request);
        return ResponseEntity.ok(discount);
    }

    /**
     * DELETE /tours/{tourId}/discounts/{discountId} [ADMIN]
     * Delete discount
     */
    @DeleteMapping("/{discountId}")
    public ResponseEntity<Void> deleteDiscount(@PathVariable Long tourId, @PathVariable Long discountId) {
        discountService.deleteDiscount(tourId, discountId);
        return ResponseEntity.ok().build();
    }
}

