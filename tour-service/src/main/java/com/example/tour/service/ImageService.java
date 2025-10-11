package com.example.tour.service;

import com.example.tour.dto.CreateImageRequest;
import com.example.tour.model.TourImage;

import java.util.List;

public interface ImageService {

    /**
     * List all images for a tour
     */
    List<TourImage> listImages(Long tourId);

    /**
     * Add image to tour
     * Logic: maintain only one isPrimary=true per tour
     */
    TourImage addImage(Long tourId, CreateImageRequest request);

    /**
     * Update image (e.g., set as primary)
     * Logic: ensure only one primary image
     */
    TourImage updateImage(Long tourId, Long imageId, CreateImageRequest request);

    /**
     * Delete image
     */
    void deleteImage(Long tourId, Long imageId);
}

