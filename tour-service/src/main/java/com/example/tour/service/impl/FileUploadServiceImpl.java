package com.example.tour.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import com.example.tour.service.FileUploadService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class FileUploadServiceImpl implements FileUploadService {

    private static final Logger logger = LoggerFactory.getLogger(FileUploadServiceImpl.class);

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;
    private static final List<String> ALLOWED_TYPES = Arrays.asList(
            "image/jpeg", "image/png", "image/jpg", "image/webp"
    );

    @Autowired
    private Cloudinary cloudinary;

    @Value("${spring.cloudinary.folder}")
    private String defaultFolder;

    @Override
    public String uploadImage(MultipartFile file, String folder) throws IOException {
        logger.info("Uploading image: {} to folder: {}", file.getOriginalFilename(), folder);


        validateFile(file);


        String targetFolder = (folder != null && !folder.isBlank()) ? folder : defaultFolder;


        Map<String, Object> uploadParams = ObjectUtils.asMap(
                "folder", targetFolder,
                "resource_type", "image",
                "transformation", new Transformation()
                        .width(1920).height(1080)
                        .crop("limit")
                        .quality("auto:good")
        );

        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);

        String imageUrl = (String) uploadResult.get("secure_url");
        logger.info("Image uploaded successfully: {}", imageUrl);

        return imageUrl;
    }

    @Override
    public void deleteImage(String publicId) throws IOException {
        if (publicId == null || publicId.isBlank()) {
            throw new IllegalArgumentException("Public ID cannot be null or empty");
        }

        logger.info("Deleting image with public ID: {}", publicId);
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        logger.info("Image deleted successfully");
    }

    @Override
    public String extractPublicId(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return null;
        }

        try {




            String[] parts = imageUrl.split("/upload/");
            if (parts.length < 2) {
                return null;
            }


            String afterUpload = parts[1];


            String withoutVersion = afterUpload.replaceFirst("v\\d+/", "");


            int lastDotIndex = withoutVersion.lastIndexOf('.');
            if (lastDotIndex > 0) {
                return withoutVersion.substring(0, lastDotIndex);
            }

            return withoutVersion;
        } catch (Exception e) {
            logger.error("Failed to extract public ID from URL: {}", imageUrl, e);
            return null;
        }
    }

    private void validateFile(MultipartFile file) {

        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }


        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    String.format("File size exceeds maximum limit of %d MB", MAX_FILE_SIZE / (1024 * 1024))
            );
        }


        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException(
                    "Invalid file type. Only JPEG, PNG, JPG, and WEBP files are allowed"
            );
        }

        logger.info("File validation passed for: {} ({})", file.getOriginalFilename(), contentType);
    }
}
