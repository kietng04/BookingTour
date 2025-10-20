package com.example.tour.repository;

import com.example.tour.model.Province;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProvinceRepository extends JpaRepository<Province, Long> {

    @Query("SELECT p FROM Province p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Province> findByNameContaining(@Param("keyword") String keyword);

    @Query("SELECT p FROM Province p WHERE p.region.id = :regionId")
    List<Province> findByRegionId(@Param("regionId") Long regionId);
}

