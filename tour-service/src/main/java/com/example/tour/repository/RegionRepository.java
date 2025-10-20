package com.example.tour.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.tour.model.Region;

public interface RegionRepository extends JpaRepository<Region, Long> {

    @Query("SELECT r FROM Region r WHERE LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Region> findByNameContaining(@Param("keyword") String keyword);
}

