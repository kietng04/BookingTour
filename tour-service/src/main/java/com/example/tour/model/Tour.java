package com.example.tour.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tours")
public class Tour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tour_id")
    private Long id;

    @Column(name = "tour_name", nullable = false)
    private String tourName;

    @Column(name = "region_id", nullable = false)
    private Integer regionId;

    @Column(name = "province_id", nullable = false)
    private Integer provinceId;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer days;

    private Integer nights;

    @Column(name = "departure_point")
    private String departurePoint;

    @Column(name = "main_destination")
    private String mainDestination;

    @Column(name = "adult_price", precision = 12, scale = 2)
    private BigDecimal adultPrice;

    @Column(name = "child_price", precision = 12, scale = 2)
    private BigDecimal childPrice;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private TourStatus status;

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<TourSchedule> schedules = new ArrayList<>();
    
    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<TourImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Departure> departures = new ArrayList<>();

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<TourDiscount> discounts = new ArrayList<>();

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<TourLog> logs = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = TourStatus.ACTIVE;
        }
    }


    public enum TourStatus {
        ACTIVE, UNACTIVE, FULL, END
    }


    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTourName() {
        return tourName;
    }

    public void setTourName(String tourName) {
        this.tourName = tourName;
    }

    public Integer getRegionId() {
        return regionId;
    }

    public void setRegionId(Integer regionId) {
        this.regionId = regionId;
    }

    public Integer getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(Integer provinceId) {
        this.provinceId = provinceId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getDays() {
        return days;
    }

    public void setDays(Integer days) {
        this.days = days;
    }

    public Integer getNights() {
        return nights;
    }

    public void setNights(Integer nights) {
        this.nights = nights;
    }

    public String getDeparturePoint() {
        return departurePoint;
    }

    public void setDeparturePoint(String departurePoint) {
        this.departurePoint = departurePoint;
    }

    public String getMainDestination() {
        return mainDestination;
    }

    public void setMainDestination(String mainDestination) {
        this.mainDestination = mainDestination;
    }

    public BigDecimal getAdultPrice() {
        return adultPrice;
    }

    public void setAdultPrice(BigDecimal adultPrice) {
        this.adultPrice = adultPrice;
    }

    public BigDecimal getChildPrice() {
        return childPrice;
    }

    public void setChildPrice(BigDecimal childPrice) {
        this.childPrice = childPrice;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public TourStatus getStatus() {
        return status;
    }

    public void setStatus(TourStatus status) {
        this.status = status;
    }

    public List<TourSchedule> getSchedules() {
        return schedules;
    }

    public void setSchedules(List<TourSchedule> schedules) {
        this.schedules = schedules;
    }

    public List<TourImage> getImages() {
        return images;
    }

    public void setImages(List<TourImage> images) {
        this.images = images;
    }

    public List<Departure> getDepartures() {
        return departures;
    }

    public void setDepartures(List<Departure> departures) {
        this.departures = departures;
    }

    public List<TourDiscount> getDiscounts() {
        return discounts;
    }

    public void setDiscounts(List<TourDiscount> discounts) {
        this.discounts = discounts;
    }

    public List<TourLog> getLogs() {
        return logs;
    }

    public void setLogs(List<TourLog> logs) {
        this.logs = logs;
    }
}

