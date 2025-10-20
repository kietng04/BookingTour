package com.example.tour.service.impl;

import com.example.tour.model.Province;
import com.example.tour.repository.ProvinceRepository;
import com.example.tour.service.ProvinceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProvinceServiceImpl implements ProvinceService {

    @Autowired
    private ProvinceRepository provinceRepository;

    @Override
    public List<Province> getAll() {
        return provinceRepository.findAll();
    }

    @Override
    public Province getById(Long id) {
        return provinceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Province not found with id: " + id));
    }

    @Override
    public List<Province> filter(String keyword) {
        return provinceRepository.findByNameContaining(keyword);
    }

    @Override
    public List<Province> getByRegion(Long regionId) {
        return provinceRepository.findByRegionId(regionId);
    }
}

