package com.omnimart.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String type; // "user", "product", "order", "system"

    @Column(nullable = false)
    private String actorName;

    @Column(nullable = false)
    private String actorRole;

    @Column(nullable = false)
    private String action;

    @Column(length = 1000)
    private String details;

    @Column(nullable = false)
    private String severity; // "info", "success", "warning", "alert"

    @Column(nullable = false)
    private LocalDateTime timestamp;

    public ActivityLog() {
        this.timestamp = LocalDateTime.now();
    }

    public ActivityLog(String type, String actorName, String actorRole, String action, String details, String severity) {
        this.type = type;
        this.actorName = actorName;
        this.actorRole = actorRole;
        this.action = action;
        this.details = details;
        this.severity = severity != null ? severity : "info";
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getActorName() { return actorName; }
    public void setActorName(String actorName) { this.actorName = actorName; }

    public String getActorRole() { return actorRole; }
    public void setActorRole(String actorRole) { this.actorRole = actorRole; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
