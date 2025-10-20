package com.example.tour.repository;

import com.example.tour.model.TourImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TourImageRepository extends JpaRepository<TourImage, Long> {

    List<TourImage> findByTourId(Long tourId);

    Optional<TourImage> findByTourIdAndIsPrimaryTrue(Long tourId);
}


