package com.example.tour.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileUploadService {

    /**
     * Upload an image to Cloudinary
     * @param file The image file to upload
     * @param folder The folder in Cloudinary to upload to
     * @return The URL of the uploaded image
     * @throws IOException if upload fails
     */
    String uploadImage(MultipartFile file, String folder) throws IOException;

    /**
     * Delete an image from Cloudinary
     * @param publicId The public ID of the image to delete
     * @throws IOException if deletion fails
     */
    void deleteImage(String publicId) throws IOException;

    /**
     * Extract public ID from Cloudinary URL
     * @param imageUrl The Cloudinary image URL
     * @return The public ID
     */
    String extractPublicId(String imageUrl);
}
