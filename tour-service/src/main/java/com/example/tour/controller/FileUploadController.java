package com.example.tour.controller;

import com.example.tour.service.FileUploadService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/upload")
public class FileUploadController {

    private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);

    @Autowired
    private FileUploadService fileUploadService;

    /**
     * Upload a single tour image
     * POST /upload/tour-image
     */
    @PostMapping("/tour-image")
    public ResponseEntity<Map<String, String>> uploadTourImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", required = false, defaultValue = "tours") String folder) {

        logger.info("Received request to upload single image");

        try {
            String imageUrl = fileUploadService.uploadImage(file, folder);

            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", imageUrl);
            response.put("message", "Upload successful");
            response.put("fileName", file.getOriginalFilename());

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            logger.warn("Validation failed for file: {}", file.getOriginalFilename(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);

        } catch (Exception e) {
            logger.error("Failed to upload image: {}", file.getOriginalFilename(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to upload image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Upload multiple tour images
     * POST /upload/tour-images
     */
    @PostMapping("/tour-images")
    public ResponseEntity<Map<String, Object>> uploadMultipleTourImages(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam(value = "folder", required = false, defaultValue = "tours") String folder) {

        logger.info("Received request to upload {} images", files.length);

        List<String> imageUrls = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                String imageUrl = fileUploadService.uploadImage(file, folder);
                imageUrls.add(imageUrl);
                logger.info("Successfully uploaded: {}", file.getOriginalFilename());

            } catch (IllegalArgumentException e) {
                String error = file.getOriginalFilename() + ": " + e.getMessage();
                errors.add(error);
                logger.warn("Validation failed for: {}", file.getOriginalFilename(), e);

            } catch (Exception e) {
                String error = file.getOriginalFilename() + ": Upload failed";
                errors.add(error);
                logger.error("Failed to upload: {}", file.getOriginalFilename(), e);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("imageUrls", imageUrls);
        response.put("errors", errors);
        response.put("successCount", imageUrls.size());
        response.put("errorCount", errors.size());
        response.put("totalCount", files.length);

        logger.info("Upload batch completed: {} success, {} errors", imageUrls.size(), errors.size());

        return ResponseEntity.ok(response);
    }

    /**
     * Delete an image
     * DELETE /upload/image
     */
    @DeleteMapping("/image")
    public ResponseEntity<Map<String, String>> deleteImage(
            @RequestParam("imageUrl") String imageUrl) {

        logger.info("Received request to delete image: {}", imageUrl);

        try {
            String publicId = fileUploadService.extractPublicId(imageUrl);

            if (publicId == null || publicId.isBlank()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid image URL");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            fileUploadService.deleteImage(publicId);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Image deleted successfully");
            response.put("deletedUrl", imageUrl);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Failed to delete image: {}", imageUrl, e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to delete image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Health check endpoint
     * GET /upload/health
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "File Upload Service");
        return ResponseEntity.ok(response);
    }
}
