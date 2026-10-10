package com.omnimart.repository;

import com.omnimart.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findBySellerId(Long sellerId);
    List<Product> findByCategory(String category);
    List<Product> findByStatus(String status);
    List<Product> findByNameContainingIgnoreCase(String query);
}
