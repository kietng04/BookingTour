package com.example.tour.service;

import com.example.tour.model.Province;
import java.util.List;

public interface ProvinceService {
    List<Province> getAll();
    Province getById(Long id);
    List<Province> filter(String keyword);
    List<Province> getByRegion(Long regionId);
}
