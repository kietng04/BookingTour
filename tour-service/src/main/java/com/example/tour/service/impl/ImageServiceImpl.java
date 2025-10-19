package com.example.tour.service.impl;

import com.example.tour.dto.CreateImageRequest;
import com.example.tour.model.Tour;
import com.example.tour.model.TourImage;
import com.example.tour.repository.TourImageRepository;
import com.example.tour.repository.TourRepository;
import com.example.tour.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImageServiceImpl implements ImageService {

    @Autowired
    private TourImageRepository imageRepository;

    @Autowired
    private TourRepository tourRepository;

    @Override
    public List<TourImage> listImages(Long tourId) {
        // TODO: Verify tour exists
        return imageRepository.findByTourId(tourId);
    }

    @Override
    public TourImage addImage(Long tourId, CreateImageRequest request) {
        // TODO: Maintain only one isPrimary=true per tour
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new RuntimeException("Tour not found"));

        TourImage image = new TourImage();
        image.setTour(tour);
        image.setImageUrl(request.getImageUrl());
        image.setIsPrimary(request.getIsPrimary() != null ? request.getIsPrimary() : false);

        return imageRepository.save(image);
    }

    @Override
    public TourImage updateImage(Long tourId, Long imageId, CreateImageRequest request) {
        // TODO: Ensure only one primary image
        TourImage image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        if (request.getImageUrl() != null) {
            image.setImageUrl(request.getImageUrl());
        }
        if (request.getIsPrimary() != null) {
            image.setIsPrimary(request.getIsPrimary());
        }

        return imageRepository.save(image);
    }

    @Override
    public void deleteImage(Long tourId, Long imageId) {
        // TODO: Verify image belongs to tour
        TourImage image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));
        imageRepository.delete(image);
    }
}

