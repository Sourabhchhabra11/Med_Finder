package com.medfinder.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.medfinder.model.Inventory;
import com.medfinder.model.Medicine;
import com.medfinder.model.Pharmacy;
import com.medfinder.repository.InventoryRepository;
import com.medfinder.repository.MedicineRepository;
import com.medfinder.repository.PharmacyRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class MedFinderController {

    private final MedicineRepository medicineRepository;
    private final PharmacyRepository pharmacyRepository;
    private final InventoryRepository inventoryRepository;

    public MedFinderController(
            MedicineRepository medicineRepository,
            PharmacyRepository pharmacyRepository,
            InventoryRepository inventoryRepository) {

        this.medicineRepository = medicineRepository;
        this.pharmacyRepository = pharmacyRepository;
        this.inventoryRepository = inventoryRepository;
    }

    @PostMapping("/medicine")
    public Medicine addMedicine(@RequestBody Medicine medicine) {
        return medicineRepository.save(medicine);
    }

    @GetMapping("/medicine")
    public List<Medicine> getMedicines() {
        return medicineRepository.findAll();
    }

    @PostMapping("/pharmacy")
    public Pharmacy addPharmacy(@RequestBody Pharmacy pharmacy) {
        return pharmacyRepository.save(pharmacy);
    }

    @GetMapping("/pharmacy")
    public List<Pharmacy> getPharmacies() {
        return pharmacyRepository.findAll();
    }

    @PostMapping("/inventory")
    public Inventory addInventory(@RequestBody Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    @GetMapping("/search")
    public List<Inventory> searchMedicine(@RequestParam String medicine) {
        return inventoryRepository.findByMedicineNameContainingIgnoreCase(medicine);
    }
}