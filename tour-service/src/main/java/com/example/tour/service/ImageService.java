package com.example.tour.service;

import com.example.tour.dto.CreateImageRequest;
import com.example.tour.model.TourImage;

import java.util.List;

public interface ImageService {

    List<TourImage> listImages(Long tourId);

    TourImage addImage(Long tourId, CreateImageRequest request);

    TourImage updateImage(Long tourId, Long imageId, CreateImageRequest request);

    void deleteImage(Long tourId, Long imageId);
}


