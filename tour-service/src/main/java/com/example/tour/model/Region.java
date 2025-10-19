package com.example.tour.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="regions")
public class Region {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="region_id")
    private Integer id;

    @Column(name="region_name", nullable = false)
    private String name;

}
