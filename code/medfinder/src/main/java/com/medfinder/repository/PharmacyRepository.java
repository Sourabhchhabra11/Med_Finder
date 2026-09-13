package com.medfinder.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.medfinder.model.Pharmacy;

public interface PharmacyRepository extends JpaRepository<Pharmacy, Long> {
}