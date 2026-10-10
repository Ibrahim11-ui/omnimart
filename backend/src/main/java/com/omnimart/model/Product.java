package com.omnimart.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private Double price;

    private Double originalPrice;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false)
    private Integer lowStockThreshold;

    private Long sellerId;
    private String sellerName;
    private Double rating;
    private Integer reviewCount;

    @Column(length = 1000)
    private String image;

    private String status; // "APPROVED", "UNDER_REVIEW", "FLAGGED"
    private Boolean featured;
    private LocalDateTime createdAt;

    public Product() {
        this.createdAt = LocalDateTime.now();
        this.status = "APPROVED";
        this.rating = 5.0;
        this.reviewCount = 1;
        this.featured = false;
        this.lowStockThreshold = 8;
    }

    public Product(String name, String description, Double price, Double originalPrice,
                   String category, Integer stock, Integer lowStockThreshold,
                   Long sellerId, String sellerName, String image, String status, Boolean featured) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.originalPrice = originalPrice;
        this.category = category;
        this.stock = stock;
        this.lowStockThreshold = lowStockThreshold != null ? lowStockThreshold : 8;
        this.sellerId = sellerId;
        this.sellerName = sellerName;
        this.image = image;
        this.status = status != null ? status : "APPROVED";
        this.featured = featured != null ? featured : false;
        this.rating = 4.8;
        this.reviewCount = 25;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Double getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(Double originalPrice) { this.originalPrice = originalPrice; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public Integer getLowStockThreshold() { return lowStockThreshold; }
    public void setLowStockThreshold(Integer lowStockThreshold) { this.lowStockThreshold = lowStockThreshold; }

    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }

    public String getSellerName() { return sellerName; }
    public void setSellerName(String sellerName) { this.sellerName = sellerName; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
