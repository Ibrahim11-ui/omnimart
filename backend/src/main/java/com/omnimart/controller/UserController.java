package com.omnimart.controller;

import com.omnimart.dto.ApiResponse;
import com.omnimart.model.ActivityLog;
import com.omnimart.model.User;
import com.omnimart.repository.ActivityLogRepository;
import com.omnimart.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;
    private final ActivityLogRepository activityLogRepository;

    public UserController(UserRepository userRepository, ActivityLogRepository activityLogRepository) {
        this.userRepository = userRepository;
        this.activityLogRepository = activityLogRepository;
    }

    // 1. List all users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // 2. Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. User Management: Create User (Input: name, email, role -> Output: Confirmation message)
    @PostMapping
    public ResponseEntity<ApiResponse<User>> createUser(@RequestBody User user) {
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("BUYER");
        }
        if (user.getStatus() == null || user.getStatus().isEmpty()) {
            user.setStatus("ACTIVE");
        }
        if (user.getAvatar() == null || user.getAvatar().isEmpty()) {
            user.setAvatar("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80");
        }

        User savedUser = userRepository.save(user);

        // System Activity log
        activityLogRepository.save(new ActivityLog(
                "user",
                savedUser.getName(),
                savedUser.getRole().toLowerCase(),
                "Registered New User Account",
                "User " + savedUser.getName() + " registered with role " + savedUser.getRole(),
                "success"
        ));

        return ResponseEntity.ok(ApiResponse.ok("Confirmation: User account created successfully!", savedUser));
    }

    // 4. User Management: Update User (Input: user details -> Output: Confirmation message)
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> updateUser(@PathVariable Long id, @RequestBody User updates) {
        return userRepository.findById(id)
                .map(existing -> {
                    if (updates.getName() != null) existing.setName(updates.getName());
                    if (updates.getEmail() != null) existing.setEmail(updates.getEmail());
                    if (updates.getRole() != null) existing.setRole(updates.getRole());
                    if (updates.getPhone() != null) existing.setPhone(updates.getPhone());
                    if (updates.getStatus() != null) existing.setStatus(updates.getStatus());

                    User saved = userRepository.save(existing);
                    activityLogRepository.save(new ActivityLog(
                            "user",
                            "Admin",
                            "admin",
                            "Updated User Profile",
                            "Modified account details for " + saved.getName(),
                            "info"
                    ));
                    return ResponseEntity.ok(ApiResponse.ok("Confirmation: User account updated successfully!", saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 5. User Management: Delete User (Output: Confirmation message)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.status(404).body(ApiResponse.<Void>error("User not found"));
        }
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            userRepository.delete(user);
            activityLogRepository.save(new ActivityLog(
                    "user",
                    "Admin",
                    "admin",
                    "Deleted User Account",
                    "Removed user " + user.getName() + " (" + user.getEmail() + ")",
                    "alert"
            ));
        }
        return ResponseEntity.ok(ApiResponse.<Void>ok("Confirmation: User account deleted successfully!", null));
    }

    // 6. Toggle Status (Active / Suspended)
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<User>> toggleStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return userRepository.findById(id)
                .map(user -> {
                    String newStatus = body.getOrDefault("status", "ACTIVE".equalsIgnoreCase(user.getStatus()) ? "SUSPENDED" : "ACTIVE");
                    user.setStatus(newStatus.toUpperCase());
                    User saved = userRepository.save(user);

                    activityLogRepository.save(new ActivityLog(
                            "user",
                            "Admin",
                            "admin",
                            "Status Changed: " + saved.getStatus(),
                            "Account status for " + saved.getName() + " changed to " + saved.getStatus(),
                            "SUSPENDED".equalsIgnoreCase(saved.getStatus()) ? "alert" : "success"
                    ));
                    return ResponseEntity.ok(ApiResponse.ok("Confirmation: User status updated to " + saved.getStatus(), saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
