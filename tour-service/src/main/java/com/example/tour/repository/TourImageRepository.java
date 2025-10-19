package com.example.tour.repository;

import com.example.tour.model.TourImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TourImageRepository extends JpaRepository<TourImage, Long> {

    // Find all images for a tour
    List<TourImage> findByTourId(Long tourId);

    // Find primary image for a tour
    Optional<TourImage> findByTourIdAndIsPrimaryTrue(Long tourId);
}

