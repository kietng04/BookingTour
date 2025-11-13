package com.example.tour.service.impl;

import com.example.tour.dto.CreateCustomTourRequest;
import com.example.tour.dto.CustomTourResponse;
import com.example.tour.dto.UpdateCustomTourStatusRequest;
import com.example.tour.model.CustomTour;
import com.example.tour.repository.CustomTourRepository;
import com.example.tour.service.CustomTourService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomTourServiceImpl implements CustomTourService {

    private static final Logger logger = LoggerFactory.getLogger(CustomTourServiceImpl.class);

    @Autowired
    private CustomTourRepository customTourRepository;

    @Override
    @Transactional
    public CustomTourResponse createCustomTour(Long userId, CreateCustomTourRequest request) {
        logger.info("Creating custom tour request for user ID: {}", userId);

        // Validate dates
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("End date must be after or equal to start date");
        }

        // Validate start date is in the future
        if (request.getStartDate().isBefore(java.time.LocalDate.now())) {
            throw new IllegalArgumentException("Start date must be in the future");
        }

        // Create custom tour entity
        CustomTour customTour = new CustomTour();
        customTour.setUserId(userId);
        customTour.setDestination(request.getDestination());
        customTour.setStartDate(request.getStartDate());
        customTour.setEndDate(request.getEndDate());
        customTour.setNumberOfPeople(request.getNumberOfPeople());
        customTour.setSpecialRequest(request.getSpecialRequest());
        customTour.setContactEmail(request.getContactEmail());
        customTour.setContactPhone(request.getContactPhone());
        customTour.setBudgetRange(request.getBudgetRange());
        customTour.setStatus(CustomTour.CustomTourStatus.PENDING);

        CustomTour saved = customTourRepository.save(customTour);
        logger.info("Custom tour request created with ID: {}", saved.getId());

        return new CustomTourResponse(saved);
    }

    @Override
    public CustomTourResponse getCustomTourById(Long id) {
        logger.info("Fetching custom tour with ID: {}", id);

        CustomTour customTour = customTourRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Custom tour not found with ID: " + id
                ));

        return new CustomTourResponse(customTour);
    }

    @Override
    public List<CustomTourResponse> getCustomToursByUserId(Long userId) {
        logger.info("Fetching custom tours for user ID: {}", userId);

        List<CustomTour> customTours = customTourRepository.findByUserIdOrderByCreatedAtDesc(userId);

        return customTours.stream()
                .map(CustomTourResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    public Page<CustomTourResponse> getAllCustomTours(CustomTour.CustomTourStatus status, Pageable pageable) {
        logger.info("Fetching all custom tours with status: {}", status);

        Page<CustomTour> customTours;
        if (status != null) {
            customTours = customTourRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
        } else {
            customTours = customTourRepository.findAllOrderByCreatedAtDesc(pageable);
        }

        return customTours.map(CustomTourResponse::new);
    }

    @Override
    public Page<CustomTourResponse> getCustomToursWithFilters(
            CustomTour.CustomTourStatus status,
            Long userId,
            String keyword,
            Pageable pageable) {
        logger.info("Fetching custom tours with filters - status: {}, userId: {}, keyword: {}",
                status, userId, keyword);

        // Sanitize keyword
        String searchKeyword = null;
        if (keyword != null && !keyword.trim().isEmpty()) {
            searchKeyword = keyword.trim().toLowerCase()
                    .replaceAll("[^\\p{L}\\p{N}\\s]", "")
                    .replaceAll("\\s+", " ");
        }

        Page<CustomTour> customTours = customTourRepository.findByFilters(
                status, userId, searchKeyword, pageable);

        return customTours.map(CustomTourResponse::new);
    }

    @Override
    @Transactional
    public CustomTourResponse updateCustomTourStatus(Long id, UpdateCustomTourStatusRequest request) {
        logger.info("Updating custom tour status for ID: {} to {}", id, request.getStatus());

        CustomTour customTour = customTourRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Custom tour not found with ID: " + id
                ));

        // Update status and admin notes
        customTour.setStatus(request.getStatus());
        customTour.setAdminNotes(request.getAdminNotes());

        CustomTour updated = customTourRepository.save(customTour);
        logger.info("Custom tour status updated successfully for ID: {}", id);

        return new CustomTourResponse(updated);
    }

    @Override
    @Transactional
    public void deleteCustomTour(Long id) {
        logger.info("Deleting custom tour with ID: {}", id);

        if (!customTourRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Custom tour not found with ID: " + id
            );
        }

        customTourRepository.deleteById(id);
        logger.info("Custom tour deleted successfully with ID: {}", id);
    }

    @Override
    public long countByStatus(CustomTour.CustomTourStatus status) {
        return customTourRepository.countByStatus(status);
    }
}
