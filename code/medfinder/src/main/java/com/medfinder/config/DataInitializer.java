package com.medfinder.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.medfinder.model.Inventory;
import com.medfinder.model.Medicine;
import com.medfinder.model.Pharmacy;
import com.medfinder.repository.InventoryRepository;
import com.medfinder.repository.MedicineRepository;
import com.medfinder.repository.PharmacyRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner loadData(
            MedicineRepository medicineRepository,
            PharmacyRepository pharmacyRepository,
            InventoryRepository inventoryRepository) {

        return args -> {

            if (inventoryRepository.count() > 0) {
                return;
            }

            Medicine paracetamol;

            if (medicineRepository.count() == 0) {
                paracetamol = medicineRepository.save(
                        new Medicine(
                                "Paracetamol",
                                "Used for pain and fever"
                        )
                );
            } else {
                paracetamol = medicineRepository.findAll().get(0);
            }

            Medicine ibuprofen = medicineRepository.save(
                    new Medicine(
                            "Ibuprofen",
                            "Used for pain and inflammation"
                    )
            );

            Pharmacy pharmacy1 = pharmacyRepository.save(
                    new Pharmacy(
                            "Apollo Pharmacy",
                            "Model Town",
                            30.9009,
                            75.8573
                    )
            );

            Pharmacy pharmacy2 = pharmacyRepository.save(
                    new Pharmacy(
                            "MedPlus",
                            "Ferozepur Road",
                            30.8890,
                            75.8240
                    )
            );

            Pharmacy pharmacy3 = pharmacyRepository.save(
                    new Pharmacy(
                            "City Care Pharmacy",
                            "Sarabha Nagar",
                            30.8960,
                            75.8310
                    )
            );

            inventoryRepository.save(
                    new Inventory(
                            paracetamol,
                            pharmacy1,
                            25.0,
                            50,
                            "Just now"
                    )
            );

            inventoryRepository.save(
                    new Inventory(
                            paracetamol,
                            pharmacy2,
                            22.0,
                            8,
                            "5 min ago"
                    )
            );

            inventoryRepository.save(
                    new Inventory(
                            paracetamol,
                            pharmacy3,
                            20.0,
                            0,
                            "10 min ago"
                    )
            );

            inventoryRepository.save(
                    new Inventory(
                            ibuprofen,
                            pharmacy1,
                            40.0,
                            25,
                            "2 min ago"
                    )
            );
        };
    }
}