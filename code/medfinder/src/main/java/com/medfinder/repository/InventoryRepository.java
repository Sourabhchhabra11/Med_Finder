package com.medfinder.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medfinder.model.Inventory;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    List<Inventory> findByMedicineNameContainingIgnoreCase(String name);
}