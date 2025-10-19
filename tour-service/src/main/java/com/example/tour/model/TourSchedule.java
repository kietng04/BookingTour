package com.example.tour.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"tour"})
@Table(name = "tour_schedules")
public class TourSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_id", nullable = false)
    @JsonBackReference
    private Tour tour;

    @Column(name = "day_number", nullable = false)
    private Integer dayNumber;

    @Column(name = "schedule_description", columnDefinition = "TEXT", nullable = false)
    private String scheduleDescription;
}

