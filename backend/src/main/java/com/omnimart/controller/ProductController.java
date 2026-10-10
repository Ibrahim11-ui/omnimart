package com.omnimart.controller;

import com.omnimart.dto.ApiResponse;
import com.omnimart.model.ActivityLog;
import com.omnimart.model.Product;
import com.omnimart.repository.ActivityLogRepository;
import com.omnimart.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductRepository productRepository;
    private final ActivityLogRepository activityLogRepository;

    public ProductController(ProductRepository productRepository, ActivityLogRepository activityLogRepository) {
        this.productRepository = productRepository;
        this.activityLogRepository = activityLogRepository;
    }

    // 1. Product Browsing: Search and filter criteria -> List of products
    @GetMapping
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {

        List<Product> list;
        if (search != null && !search.trim().isEmpty()) {
            list = productRepository.findByNameContainingIgnoreCase(search);
        } else if (category != null && !category.equalsIgnoreCase("All")) {
            list = productRepository.findByCategory(category);
        } else if (status != null) {
            list = productRepository.findByStatus(status.toUpperCase());
        } else {
            list = productRepository.findAll();
        }
        return ResponseEntity.ok(list);
    }

    // 2. Get product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Seller listings
    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<Product>> getSellerProducts(@PathVariable Long sellerId) {
        return ResponseEntity.ok(productRepository.findBySellerId(sellerId));
    }

    // 4. Product Listing: Create Product Listing (Input: Product details -> Output: Confirmation message)
    @PostMapping
    public ResponseEntity<ApiResponse<Product>> createProduct(@RequestBody Product product) {
        if (product.getStatus() == null) product.setStatus("APPROVED");
        if (product.getLowStockThreshold() == null) product.setLowStockThreshold(8);
        if (product.getRating() == null) product.setRating(5.0);
        if (product.getReviewCount() == null) product.setReviewCount(1);

        Product saved = productRepository.save(product);

        activityLogRepository.save(new ActivityLog(
                "product",
                saved.getSellerName() != null ? saved.getSellerName() : "Seller",
                "seller",
                "Created New Listing",
                "Product \"" + saved.getName() + "\" listed under " + saved.getCategory() + " for $" + saved.getPrice(),
                "success"
        ));

        return ResponseEntity.ok(ApiResponse.ok("Confirmation: Product listed successfully!", saved));
    }

    // 5. Product Management: Update Product (Input: details -> Output: Confirmation message)
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> updateProduct(@PathVariable Long id, @RequestBody Product updates) {
        return productRepository.findById(id)
                .map(existing -> {
                    if (updates.getName() != null) existing.setName(updates.getName());
                    if (updates.getDescription() != null) existing.setDescription(updates.getDescription());
                    if (updates.getPrice() != null) existing.setPrice(updates.getPrice());
                    if (updates.getOriginalPrice() != null) existing.setOriginalPrice(updates.getOriginalPrice());
                    if (updates.getCategory() != null) existing.setCategory(updates.getCategory());
                    if (updates.getStock() != null) existing.setStock(updates.getStock());
                    if (updates.getLowStockThreshold() != null) existing.setLowStockThreshold(updates.getLowStockThreshold());
                    if (updates.getImage() != null) existing.setImage(updates.getImage());
                    if (updates.getStatus() != null) existing.setStatus(updates.getStatus());

                    Product saved = productRepository.save(existing);
                    return ResponseEntity.ok(ApiResponse.ok("Confirmation: Product updated successfully!", saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 6. Product Management: Delete Product (Output: Confirmation message)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.status(404).body(ApiResponse.<Void>error("Product not found"));
        }
        Product product = productRepository.findById(id).orElse(null);
        if (product != null) {
            productRepository.delete(product);
            activityLogRepository.save(new ActivityLog(
                    "product",
                    "Admin/Seller",
                    "admin",
                    "Deleted Product Listing",
                    "Removed listing \"" + product.getName() + "\" from catalog.",
                    "warning"
            ));
        }
        return ResponseEntity.ok(ApiResponse.<Void>ok("Confirmation: Product removed from catalog successfully!", null));
    }

    // 7. Inventory Management: Update stock (Input: stock -> Output: Inventory update confirmation & alerts)
    @PatchMapping("/{id}/stock")
    public ResponseEntity<ApiResponse<Product>> updateStock(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        return productRepository.findById(id)
                .map(product -> {
                    Integer newStock = body.get("stock");
                    if (newStock != null) {
                        product.setStock(Math.max(0, newStock));
                    }
                    Product saved = productRepository.save(product);

                    if (saved.getStock() <= saved.getLowStockThreshold()) {
                        activityLogRepository.save(new ActivityLog(
                                "system",
                                "Inventory Guard",
                                "system",
                                "Low Stock Alert Triggered",
                                "\"" + saved.getName() + "\" stock is critically low (" + saved.getStock() + " remaining).",
                                "warning"
                        ));
                    }

                    return ResponseEntity.ok(ApiResponse.ok("Confirmation: Inventory updated to " + saved.getStock() + " units.", saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 8. Compliance status update (Admin)
    @PatchMapping("/{id}/compliance")
    public ResponseEntity<ApiResponse<Product>> updateCompliance(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return productRepository.findById(id)
                .map(product -> {
                    String status = body.getOrDefault("status", "APPROVED");
                    product.setStatus(status.toUpperCase());
                    Product saved = productRepository.save(product);

                    activityLogRepository.save(new ActivityLog(
                            "product",
                            "Admin",
                            "admin",
                            "Compliance: " + saved.getStatus(),
                            "Catalog status for \"" + saved.getName() + "\" set to " + saved.getStatus(),
                            "APPROVED".equalsIgnoreCase(saved.getStatus()) ? "success" : "alert"
                    ));

                    return ResponseEntity.ok(ApiResponse.ok("Confirmation: Compliance status updated to " + saved.getStatus(), saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
