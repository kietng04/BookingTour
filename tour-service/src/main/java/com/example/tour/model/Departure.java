package com.example.tour.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"tour"})
@Table(name = "departures")
public class Departure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "departure_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_id", nullable = false)
    private Tour tour;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "total_slots", nullable = false)
    private Integer totalSlots;

    @Column(name = "remaining_slots", nullable = false)
    private Integer remainingSlots;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private DepartureStatus status;

    @PrePersist
    protected void onCreate() {
        if (remainingSlots == null) {
            remainingSlots = totalSlots;
        }
        if (status == null) {
            status = DepartureStatus.ConCho;
        }
    }

    public enum DepartureStatus {
        ConCho, SapFull, Full, DaKhoiHanh
    }
}

