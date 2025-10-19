package com.example.tour.service;

import java.util.List;

import com.example.tour.model.Region;

public interface RegionService {
    List<Region> getAll();
    Region getById(Long id);
    List<Region> filter(String keyword);
}
