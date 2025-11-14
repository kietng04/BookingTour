package com.example.tour.service.impl;

import com.example.tour.dto.CreateTourRequest;
import com.example.tour.dto.UpdateTourRequest;
import com.example.tour.dto.TourScheduleRequest;
import com.example.tour.model.Tour;
import com.example.tour.model.TourSchedule;
import com.example.tour.repository.TourRepository;
import com.example.tour.service.TourService;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.IntStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TourServiceImpl implements TourService {

    @Autowired
    private TourRepository tourRepository;


    @Override
    public Page<Tour> listTours(
            Integer regionId,
            Integer provinceId,
            String status,
            String keyword,
            java.time.LocalDate startDate,
            java.time.LocalDate endDate,
            Pageable pageable) {
        Tour.TourStatus tourStatus = null;
        if (status != null && !status.isBlank()) {
            try {
                String normalizedStatus = status.trim().toUpperCase();
                tourStatus = Tour.TourStatus.valueOf(normalizedStatus);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Trạng thái không hợp lệ: " + status +
                    ". Các giá trị hợp lệ: ACTIVE, UNACTIVE, FULL, END");
            }
        }

        if (startDate != null && endDate != null && endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu");
        }

        String searchKeyword = null;
        if (keyword != null && !keyword.trim().isEmpty()) {
            searchKeyword = keyword.trim().toLowerCase()
                    .replaceAll("[^\\p{L}\\p{N}\\s]", "")
                    .replaceAll("\\s+", " ");
        }

    boolean applyStartDateFilter = startDate != null;
    boolean applyEndDateFilter = endDate != null;
    boolean applyDateFilter = applyStartDateFilter || applyEndDateFilter;

        return tourRepository.findByFilters(
                regionId,
                provinceId,
                tourStatus,
                searchKeyword,
        applyDateFilter,
        applyStartDateFilter,
        applyEndDateFilter,
                startDate,
                endDate,
                pageable);
    }



    
    @Override
    public Tour getTourById(Long id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tour với id = " + id));
        return tour;
    }

    @Override
    public Tour getTourBySlug(String slug) {
        if (slug == null || slug.isBlank()) {
            throw new IllegalArgumentException("Slug không được để trống");
        }
        String normalized = slug.trim().toLowerCase();
        return tourRepository.findBySlug(normalized)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy tour với slug = " + slug));
    }


    @Override
    public Tour createTour(CreateTourRequest request) {
        validateTourName(request.getTourName());
        validateProvinceAndRegion(request.getProvinceId(), request.getRegionId());
        validateDayAndNight(request.getDays(), request.getNights());
        validateLocation(request.getDeparturePoint(), request.getMainDestination());
        validatePrice(request.getChildPrice(), request.getAdultPrice());
        validateDescription(request.getDescription());
        
        if (request.getSchedules() != null && !request.getSchedules().isEmpty())
            validateSchedules(request.getSchedules(), request.getDays());
        
        Tour tour = new Tour();
        tour.setTourName(request.getTourName().trim());
        if (request.getSlug() != null && !request.getSlug().isBlank()) {
            tour.setSlug(request.getSlug().trim());
        }
        tour.setRegionId(request.getRegionId());
        tour.setProvinceId(request.getProvinceId());
        tour.setDescription(request.getDescription().trim());
        tour.setDays(request.getDays());
        tour.setNights(request.getNights());
        tour.setDeparturePoint(request.getDeparturePoint().trim());
        tour.setMainDestination(request.getMainDestination().trim());
        tour.setAdultPrice(request.getAdultPrice());
        tour.setChildPrice(request.getChildPrice());
        if (request.getHeroImageUrl() != null && !request.getHeroImageUrl().isBlank()) {
            tour.setHeroImageUrl(request.getHeroImageUrl().trim());
        }
        
        if (request.getSchedules() != null && !request.getSchedules().isEmpty()) {
            List<TourSchedule> schedules = request.getSchedules().stream()
            .map(scheduleRequest -> {
                TourSchedule schedule = new TourSchedule();
                schedule.setDayNumber(scheduleRequest.getDayNumber());
                schedule.setScheduleDescription(scheduleRequest.getScheduleDescription().trim());
                schedule.setTour(tour);
                return schedule;
            }).toList();

            tour.setSchedules(schedules);
        }
        return tourRepository.save(tour);
    }

    @Override
    public Tour updateTour(Long id, UpdateTourRequest request) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tour với id = " + id));
       
        if (request.getTourName() != null) {
            validateTourName(request.getTourName());
            tour.setTourName(request.getTourName());
        }
        if (request.getSlug() != null && !request.getSlug().isBlank()) {
            tour.setSlug(request.getSlug().trim());
        }
        if (request.getRegionId() != null)
            tour.setRegionId(request.getRegionId());

        if (request.getProvinceId() != null)
            tour.setProvinceId(request.getProvinceId());

        if (request.getDescription() != null) {
            validateDescription(request.getDescription());
            tour.setDescription(request.getDescription());
        }
        if (request.getDays() != null)
            tour.setDays(request.getDays());

        if (request.getNights() != null)
            tour.setNights(request.getNights());

        if (request.getDeparturePoint() != null)
            tour.setDeparturePoint(request.getDeparturePoint());

        if (request.getMainDestination() != null)
            tour.setMainDestination(request.getMainDestination());

        if (request.getAdultPrice() != null)
            tour.setAdultPrice(request.getAdultPrice());

        if (request.getChildPrice() != null)
            tour.setChildPrice(request.getChildPrice());

        if (request.getHeroImageUrl() != null && !request.getHeroImageUrl().isBlank()) {
            tour.setHeroImageUrl(request.getHeroImageUrl().trim());
        }
        
    
        if (request.getAdultPrice() != null && request.getChildPrice() != null) 
            validatePrice(request.getChildPrice(), request.getAdultPrice());
        
        if (request.getStatus() != null) 
            tour.setStatus(Tour.TourStatus.valueOf(request.getStatus()));
        
        
        return tourRepository.save(tour);
    }

    @Override
    public void deleteTour(Long id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tour với id = " + id));
        
        tour.setStatus(Tour.TourStatus.UNACTIVE);
        tourRepository.save(tour);
    }


    private void validateTourName(String name) {
        String regex = "^[\\p{L}\\p{N}\\s,-]+$";
        if (name == null || name.isBlank())
            throw new IllegalArgumentException("Tên tour không được để trống");
        
        name = name.trim();
        if (name.length() < 5 || name.length() > 100) 
            throw new IllegalArgumentException("Tên tour phải có độ dài từ 5 đến 100 ký tự");
        
        if (!name.matches(regex))
            throw new IllegalArgumentException("Tên tour chỉ được chứa chữ, số và khoảng trắng (có thể có dấu tiếng Việt)");
        
    }

    private void validateProvinceAndRegion(Integer provinceId, Integer regionId){
        if (provinceId == null || regionId == null) 
            throw new IllegalArgumentException("Vui lòng chọn khu vực và tỉnh/thành phố cho tour");
        

        
    }

    private void validateDayAndNight(Integer day, Integer night){
        if ( day == null || day <= 0)
            throw new IllegalArgumentException("Số ngày phải là số nguyên dương");
        if ( night == null || night < 0)
            throw new IllegalArgumentException("Số đêm phải là số nguyên dương");
        
    }
   
    private void validateLocation(String departurePoint, String mainDestination){
        if ( departurePoint == null || departurePoint.isBlank())
            throw new IllegalArgumentException("Điểm khởi hành không được để trống");
        if ( mainDestination == null || mainDestination.isBlank())
            throw new IllegalArgumentException("Điểm đến chính không được để trống");

    }
    
    private void validatePrice(BigDecimal childPrice, BigDecimal adultPrice){
        if ( adultPrice == null || adultPrice.compareTo(BigDecimal.ZERO) <= 0)
            throw new IllegalArgumentException("Giá người lớn phải là số dương");
        if ( childPrice == null || childPrice.compareTo(BigDecimal.ZERO) < 0)
            throw new IllegalArgumentException("Giá trẻ em phải là số dương");
        if (childPrice.compareTo(adultPrice) > 0) {
            throw new IllegalArgumentException("Giá trẻ em không thể cao hơn giá người lớn");
        }
    }

    private void validateDescription(String description){
        if ( description == null || description.isBlank())
            throw new IllegalArgumentException("Mô tả tour không được để trống");
    }

    private void validateSchedules(List<TourScheduleRequest> schedules, Integer totalDays) {
        if (schedules == null || schedules.isEmpty()) 
            throw new IllegalArgumentException("Lịch trình tour không được để trống");
        
        Set<Integer> dayNumbers = new HashSet<>();
        for (TourScheduleRequest schedule : schedules) {
            if (schedule.getDayNumber() == null || schedule.getDayNumber() <= 0) 
                throw new IllegalArgumentException("Số ngày trong lịch trình phải là số nguyên dương");
            
            if (schedule.getDayNumber() > totalDays) 
                throw new IllegalArgumentException("Số ngày trong lịch trình không được vượt quá tổng số ngày của tour");
            
            if (!dayNumbers.add(schedule.getDayNumber())) 
                throw new IllegalArgumentException("Số ngày " + schedule.getDayNumber() + " bị trùng lặp trong lịch trình");
            
            if (schedule.getScheduleDescription() == null || schedule.getScheduleDescription().isBlank()) 
                throw new IllegalArgumentException("Mô tả lịch trình ngày " + schedule.getDayNumber() + " không được để trống");
            
            if (schedule.getScheduleDescription().trim().length() < 10) 
                throw new IllegalArgumentException("Mô tả lịch trình ngày " + schedule.getDayNumber() + " phải có ít nhất 10 ký tự");
            
        }
        List<Integer> missingDays = IntStream.rangeClosed(1, totalDays)
        .filter(i -> !dayNumbers.contains(i))
        .boxed()
        .toList();

        if (!missingDays.isEmpty()) 
            throw new IllegalArgumentException("Thiếu lịch trình cho các ngày: " + missingDays);
        
            
        
    }
}


