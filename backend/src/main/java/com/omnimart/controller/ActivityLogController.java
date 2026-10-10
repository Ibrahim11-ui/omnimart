package com.omnimart.controller;

import com.omnimart.dto.ApiResponse;
import com.omnimart.model.ActivityLog;
import com.omnimart.repository.ActivityLogRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "*")
public class ActivityLogController {

    private final ActivityLogRepository activityLogRepository;

    public ActivityLogController(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }

    // 1. Get live stream of system activity monitoring
    @GetMapping
    public ResponseEntity<List<ActivityLog>> getActivities(@RequestParam(required = false) String type) {
        if (type != null && !type.equalsIgnoreCase("all")) {
            return ResponseEntity.ok(activityLogRepository.findByTypeOrderByTimestampDesc(type.toLowerCase()));
        }
        return ResponseEntity.ok(activityLogRepository.findAllByOrderByTimestampDesc());
    }

    // 2. Trigger simulated security integrity check
    @PostMapping("/simulate")
    public ResponseEntity<ApiResponse<ActivityLog>> simulateEvent() {
        ActivityLog log = activityLogRepository.save(new ActivityLog(
                "system",
                "Audit Daemon",
                "system",
                "Automated Security Integrity Scan",
                "Verified payment gateway cryptography and session credentials. 0 anomalies detected.",
                "info"
        ));
        return ResponseEntity.ok(ApiResponse.ok("Security audit event triggered successfully!", log));
    }
}
