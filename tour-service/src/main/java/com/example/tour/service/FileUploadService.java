package com.example.tour.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileUploadService {


    String uploadImage(MultipartFile file, String folder) throws IOException;


    void deleteImage(String publicId) throws IOException;


    String extractPublicId(String imageUrl);
}
