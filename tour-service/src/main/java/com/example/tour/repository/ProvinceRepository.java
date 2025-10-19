package com.example.tour.repository;

import com.example.tour.model.Province;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProvinceRepository extends JpaRepository<Province, Long> {

    // Lọc theo tên tỉnh
    @Query("SELECT p FROM Province p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Province> findByNameContaining(@Param("keyword") String keyword);

    // Lấy danh sách tỉnh theo region_id
    @Query("SELECT p FROM Province p WHERE p.region.id = :regionId")
    List<Province> findByRegionId(@Param("regionId") Long regionId);
}
