package com.omnimart.controller;

import com.omnimart.dto.ApiResponse;
import com.omnimart.dto.OrderRequest;
import com.omnimart.model.ActivityLog;
import com.omnimart.model.Order;
import com.omnimart.model.OrderItem;
import com.omnimart.model.Product;
import com.omnimart.model.User;
import com.omnimart.repository.ActivityLogRepository;
import com.omnimart.repository.OrderRepository;
import com.omnimart.repository.ProductRepository;
import com.omnimart.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ActivityLogRepository activityLogRepository;

    public OrderController(OrderRepository orderRepository, ProductRepository productRepository,
                           UserRepository userRepository, ActivityLogRepository activityLogRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.activityLogRepository = activityLogRepository;
    }

    // 1. List all global orders (Admin)
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAllByOrderByCreatedAtDesc());
    }

    // 2. Track order by ID or orderNumber (Order Tracking)
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Buyer order history
    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<List<Order>> getBuyerOrders(@PathVariable Long buyerId) {
        return ResponseEntity.ok(orderRepository.findByBuyerIdOrderByCreatedAtDesc(buyerId));
    }

    // 4. Seller orders (orders containing seller's items)
    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<Order>> getSellerOrders(@PathVariable Long sellerId) {
        return ResponseEntity.ok(orderRepository.findOrdersBySellerId(sellerId));
    }

    // 5. Purchase Products (Input: Selected products, shipping, payment -> Output: Order confirmation)
    @PostMapping
    public ResponseEntity<ApiResponse<Order>> placeOrder(@RequestBody OrderRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Cart cannot be empty!"));
        }

        User buyer = userRepository.findById(request.getBuyerId()).orElse(null);
        String buyerName = buyer != null ? buyer.getName() : "Customer";
        String buyerEmail = buyer != null ? buyer.getEmail() : "customer@example.com";

        Order order = new Order();
        order.setBuyerId(request.getBuyerId());
        order.setBuyerName(buyerName);
        order.setBuyerEmail(buyerEmail);

        double subtotal = 0.0;

        for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId()).orElse(null);
            if (product != null) {
                // Stock deduction
                int deductQty = itemReq.getQuantity() != null ? itemReq.getQuantity() : 1;
                product.setStock(Math.max(0, product.getStock() - deductQty));
                productRepository.save(product);

                OrderItem item = new OrderItem(
                        product.getId(),
                        product.getName(),
                        product.getPrice(),
                        deductQty,
                        product.getImage(),
                        product.getSellerId()
                );
                order.addItem(item);
                subtotal += product.getPrice() * deductQty;
            }
        }

        double discount = request.getDiscountAmount() != null ? request.getDiscountAmount() : 0.0;
        double shipping = subtotal > 150 ? 0.0 : 15.0;
        double total = Math.max(0, subtotal - discount + shipping);

        Random rnd = new Random();
        order.setOrderNumber("OM-" + (10000 + rnd.nextInt(90000)));
        order.setTrackingNumber("TRK-US-" + (1000000 + rnd.nextInt(9000000)));
        order.setEstimatedDelivery("Oct 16, 2026");
        order.setSubtotal(subtotal);
        order.setDiscountAmount(discount);
        order.setShippingFee(shipping);
        order.setTotalAmount(total);
        order.setStatus("PENDING");

        order.setShippingStreet(request.getShippingStreet() != null ? request.getShippingStreet() : "Main St");
        order.setShippingCity(request.getShippingCity() != null ? request.getShippingCity() : "Austin");
        order.setShippingState(request.getShippingState() != null ? request.getShippingState() : "TX");
        order.setShippingZipCode(request.getShippingZipCode() != null ? request.getShippingZipCode() : "78701");
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "Visa ****4242");

        Order saved = orderRepository.save(order);

        activityLogRepository.save(new ActivityLog(
                "order",
                buyerName,
                "buyer",
                "Placed Order #" + saved.getOrderNumber(),
                "Customer purchased " + saved.getItems().size() + " item(s) for $" + saved.getTotalAmount(),
                "success"
        ));

        return ResponseEntity.ok(ApiResponse.ok("Confirmation: Order #" + saved.getOrderNumber() + " placed successfully!", saved));
    }

    // 6. Order Status Update (Seller & Admin: Output: Order status updates)
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return orderRepository.findById(id)
                .map(order -> {
                    String newStatus = body.getOrDefault("status", "PROCESSING");
                    order.setStatus(newStatus.toUpperCase());
                    Order saved = orderRepository.save(order);

                    activityLogRepository.save(new ActivityLog(
                            "order",
                            "Fulfillment Engine",
                            "seller",
                            "Order #" + saved.getOrderNumber() + " Updated",
                            "Status progressed to " + saved.getStatus(),
                            "info"
                    ));

                    return ResponseEntity.ok(ApiResponse.ok("Confirmation: Order status updated to " + saved.getStatus(), saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 7. Order Cancellation & Stock Restoration (Admin / Resolution)
    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Order>> cancelOrder(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        return orderRepository.findById(id)
                .map(order -> {
                    order.setStatus("CANCELLED");

                    // Restore stock to inventory
                    for (OrderItem item : order.getItems()) {
                        productRepository.findById(item.getProductId()).ifPresent(prod -> {
                            prod.setStock(prod.getStock() + item.getQuantity());
                            productRepository.save(prod);
                        });
                    }

                    Order saved = orderRepository.save(order);

                    String reason = (body != null && body.containsKey("reason")) ? body.get("reason") : "Administrative cancellation & refund";
                    activityLogRepository.save(new ActivityLog(
                            "order",
                            "Admin",
                            "admin",
                            "Cancelled Order #" + saved.getOrderNumber(),
                            "Order cancelled. Stock restored. Reason: " + reason,
                            "alert"
                    ));

                    return ResponseEntity.ok(ApiResponse.ok("Confirmation: Order #" + saved.getOrderNumber() + " has been cancelled and refunded.", saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
