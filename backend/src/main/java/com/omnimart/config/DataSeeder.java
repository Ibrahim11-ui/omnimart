package com.omnimart.config;

import com.omnimart.model.ActivityLog;
import com.omnimart.model.Order;
import com.omnimart.model.OrderItem;
import com.omnimart.model.Product;
import com.omnimart.model.User;
import com.omnimart.repository.ActivityLogRepository;
import com.omnimart.repository.OrderRepository;
import com.omnimart.repository.ProductRepository;
import com.omnimart.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ActivityLogRepository activityLogRepository;

    public DataSeeder(UserRepository userRepository, ProductRepository productRepository,
                      OrderRepository orderRepository, ActivityLogRepository activityLogRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.activityLogRepository = activityLogRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        // 1. Seed Users
        User admin = userRepository.save(new User(
                "Eleanor Vance", "admin@omnimart.io", "ADMIN", "ACTIVE",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
                "+1 (555) 234-5678"
        ));

        User seller1 = userRepository.save(new User(
                "David Chen", "david@aerotech.com", "SELLER", "ACTIVE",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
                "+1 (555) 876-5432"
        ));

        User seller2 = userRepository.save(new User(
                "Elena Rostova", "elena@lumina.design", "SELLER", "ACTIVE",
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80",
                "+1 (555) 432-1098"
        ));

        User buyer1 = userRepository.save(new User(
                "Alex Rivera", "alex.rivera@gmail.com", "BUYER", "ACTIVE",
                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&h=200&q=80",
                "+1 (555) 314-1592"
        ));

        User buyer2 = userRepository.save(new User(
                "Sophia Martinez", "sophia.m@gmail.com", "BUYER", "ACTIVE",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80",
                "+1 (555) 777-9922"
        ));

        User buyer3 = userRepository.save(new User(
                "Marcus Thorne", "marcus.t@outlook.com", "BUYER", "SUSPENDED",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
                "+1 (555) 998-1122"
        ));

        // 2. Seed Products
        Product p1 = productRepository.save(new Product(
                "Apex Pro ANC Wireless Headphones",
                "Audiophile-grade 40mm beryllium drivers, active hybrid noise cancellation with 40-hour battery life.",
                349.99, 399.99, "Audio", 24, 10,
                seller1.getId(), "AeroTech Studio",
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
                "APPROVED", true
        ));

        Product p2 = productRepository.save(new Product(
                "CyberBlade Ergonomic Mechanical Keyboard",
                "Hot-swappable tactile switches, aerospace anodized aluminum chassis, custom RGB matrix.",
                189.50, 220.00, "Workspaces", 7, 10,
                seller1.getId(), "AeroTech Studio",
                "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
                "APPROVED", true
        ));

        Product p3 = productRepository.save(new Product(
                "Chronos Horizon Smartwatch Ultra",
                "Dual-frequency GPS, sapphire glass touchscreen, titanium bezel, ECG biometric tracking.",
                499.00, 549.00, "Wearables", 18, 8,
                seller1.getId(), "AeroTech Studio",
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
                "APPROVED", true
        ));

        Product p4 = productRepository.save(new Product(
                "Lumina Sculptural Ambient Desk Lamp",
                "Architectural desk fixture with touch dimmer, adjustable color temperature, Qi wireless charging base.",
                145.00, 175.00, "Home & Living", 32, 8,
                seller2.getId(), "Lumina Lifestyle",
                "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
                "APPROVED", true
        ));

        Product p5 = productRepository.save(new Product(
                "Nordic Ceramic Coffee Carafe & Dripper Set",
                "Hand-thrown matte ceramic slow-drip coffee system with double-wall thermal insulation.",
                68.00, 85.00, "Home & Living", 4, 10,
                seller2.getId(), "Lumina Lifestyle",
                "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
                "APPROVED", false
        ));

        Product p6 = productRepository.save(new Product(
                "OmniStream 4K Studio Webcam & Ring Light",
                "Ultra-low distortion Sony sensor, AI auto-framing, dual beamforming microphone array.",
                129.99, 159.99, "Electronics", 29, 12,
                seller1.getId(), "AeroTech Studio",
                "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80",
                "APPROVED", false
        ));

        // 3. Seed Orders
        Order o1 = new Order();
        o1.setOrderNumber("OM-90284");
        o1.setBuyerId(buyer1.getId());
        o1.setBuyerName(buyer1.getName());
        o1.setBuyerEmail(buyer1.getEmail());
        o1.setSubtotal(349.99);
        o1.setDiscountAmount(20.00);
        o1.setShippingFee(0.0);
        o1.setTotalAmount(329.99);
        o1.setShippingStreet("842 Pinecone Blvd Apt 3B");
        o1.setShippingCity("Austin");
        o1.setShippingState("TX");
        o1.setShippingZipCode("78701");
        o1.setPaymentMethod("Visa ****4242");
        o1.setStatus("SHIPPED");
        o1.setTrackingNumber("TRK-US-8891024");
        o1.setEstimatedDelivery("Oct 14, 2026");
        o1.addItem(new OrderItem(p1.getId(), p1.getName(), p1.getPrice(), 1, p1.getImage(), seller1.getId()));
        orderRepository.save(o1);

        Order o2 = new Order();
        o2.setOrderNumber("OM-90245");
        o2.setBuyerId(buyer1.getId());
        o2.setBuyerName(buyer1.getName());
        o2.setBuyerEmail(buyer1.getEmail());
        o2.setSubtotal(145.00);
        o2.setDiscountAmount(0.0);
        o2.setShippingFee(0.0);
        o2.setTotalAmount(145.00);
        o2.setShippingStreet("842 Pinecone Blvd Apt 3B");
        o2.setShippingCity("Austin");
        o2.setShippingState("TX");
        o2.setShippingZipCode("78701");
        o2.setPaymentMethod("Visa ****4242");
        o2.setStatus("DELIVERED");
        o2.setTrackingNumber("TRK-US-7712399");
        o2.setEstimatedDelivery("Oct 02, 2026");
        o2.addItem(new OrderItem(p4.getId(), p4.getName(), p4.getPrice(), 1, p4.getImage(), seller2.getId()));
        orderRepository.save(o2);

        // 4. Seed Activity Logs
        activityLogRepository.save(new ActivityLog("order", "Alex Rivera", "buyer", "Placed New Order #OM-90284", "Purchased Apex Pro Headphones for $329.99", "success"));
        activityLogRepository.save(new ActivityLog("product", "David Chen", "seller", "Updated Inventory Level", "Adjusted Apex Pro ANC stock to 24 units", "info"));
        activityLogRepository.save(new ActivityLog("order", "David Chen", "seller", "Dispatched Order #OM-90284", "Handed parcel to Express Logistics (TRK-US-8891024)", "info"));
        activityLogRepository.save(new ActivityLog("system", "System Monitor", "system", "Low Stock Alert Triggered", "CyberBlade Mechanical Keyboard is at 7 units (Threshold: 10)", "warning"));
        activityLogRepository.save(new ActivityLog("user", "Eleanor Vance", "admin", "Account Suspended", "Suspended user Marcus Thorne due to payment policy review", "alert"));
    }
}
