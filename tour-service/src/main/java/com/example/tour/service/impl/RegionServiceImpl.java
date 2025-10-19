package com.example.tour.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.tour.model.Region;
import com.example.tour.repository.RegionRepository;
import com.example.tour.service.RegionService;

@Service
public class RegionServiceImpl implements RegionService {

    @Autowired
    private RegionRepository regionRepository;

    @Override
    public List<Region> getAll() {
        return regionRepository.findAll();
    }

    @Override
    public Region getById(Long id) {
        return regionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Region not found"));
    }

    @Override
    public List<Region> filter(String keyword) {
        return regionRepository.findByNameContaining(keyword);
    }
}
