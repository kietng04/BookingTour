package com.example.tour.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.tour.model.Province;
import com.example.tour.service.ProvinceService;

@RestController
@RequestMapping("/tours/provinces")
public class ProvinceController {

    @Autowired
    private ProvinceService provinceService;

    @GetMapping
    public ResponseEntity<List<Province>> getAllProvinces() {
        return ResponseEntity.ok(provinceService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Province> getProvinceById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(provinceService.getById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Province>> filterProvinces(@RequestParam String keyword) {
        return ResponseEntity.ok(provinceService.filter(keyword));
    }

    @GetMapping("/region/{regionId}")
    public ResponseEntity<List<Province>> getProvincesByRegion(@PathVariable Long regionId) {
        return ResponseEntity.ok(provinceService.getByRegion(regionId));
    }
}

