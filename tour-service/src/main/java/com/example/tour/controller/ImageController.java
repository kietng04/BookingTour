package com.example.tour.controller;

import com.example.tour.dto.CreateImageRequest;
import com.example.tour.model.TourImage;
import com.example.tour.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tours/{tourId}/images")
public class ImageController {

    @Autowired
    private ImageService imageService;

    @GetMapping
    public ResponseEntity<List<TourImage>> listImages(@PathVariable Long tourId) {
        List<TourImage> images = imageService.listImages(tourId);
        return ResponseEntity.ok(images);
    }

    @PostMapping
    public ResponseEntity<TourImage> addImage(@PathVariable Long tourId,
                                               @RequestBody CreateImageRequest request) {
        TourImage image = imageService.addImage(tourId, request);
        return ResponseEntity.ok(image);
    }

    @PutMapping("/{imageId}")
    public ResponseEntity<TourImage> updateImage(@PathVariable Long tourId,
                                                  @PathVariable Long imageId,
                                                  @RequestBody CreateImageRequest request) {
        TourImage image = imageService.updateImage(tourId, imageId, request);
        return ResponseEntity.ok(image);
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long tourId, @PathVariable Long imageId) {
        imageService.deleteImage(tourId, imageId);
        return ResponseEntity.ok().build();
    }
}


