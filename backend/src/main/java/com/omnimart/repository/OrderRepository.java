package com.omnimart.repository;

import com.omnimart.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBuyerIdOrderByCreatedAtDesc(Long buyerId);
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByStatusOrderByCreatedAtDesc(String status);
    List<Order> findAllByOrderByCreatedAtDesc();

    @Query("SELECT DISTINCT o FROM Order o JOIN o.items i WHERE i.sellerId = :sellerId ORDER BY o.createdAt DESC")
    List<Order> findOrdersBySellerId(@Param("sellerId") Long sellerId);
}
