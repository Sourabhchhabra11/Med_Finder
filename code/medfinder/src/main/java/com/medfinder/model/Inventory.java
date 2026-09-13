package com.medfinder.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "medicine_id")
    private Medicine medicine;

    @ManyToOne
    @JoinColumn(name = "pharmacy_id")
    private Pharmacy pharmacy;
    private double price;
    private int stock;
    private String lastUpdated;

    public Inventory() {
    }

    public Inventory(Medicine medicine, Pharmacy pharmacy, double price, int stock, String lastUpdated) {
        this.medicine = medicine;
        this.pharmacy = pharmacy;
        this.price = price;
        this.stock = stock;
        this.lastUpdated = lastUpdated;
    }
    public Long getId() {
        return id;
    }
    public Medicine getMedicine() {
        return medicine;
    }
    public Pharmacy getPharmacy() {
        return pharmacy;
    }
    public double getPrice() {
        return price;
    }
    public int getStock() {
        return stock;
    }
    public String getLastUpdated() {
        return lastUpdated;
    }
}