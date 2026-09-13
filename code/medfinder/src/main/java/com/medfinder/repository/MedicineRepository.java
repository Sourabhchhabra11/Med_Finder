package com.medfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medfinder.model.Medicine;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {
}