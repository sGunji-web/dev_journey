package com.example.demo.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import lombok.Data;

@Entity
@Data
@Table(name = "progress")
public class Progress {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "UUID")
    private UUID id;

    @Column(name = "task_name", nullable = false, length = 255)
    private String taskName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "assigned_user")
    private Long assignedUser;  // User エンティティとの外部キー関係

    @Column(nullable = false, length = 50)
    private String status = "Not Started";
    
    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "completed_at")
    private LocalDate completedAt;

    @Column(name = "progress_percentage", nullable = false)
    private int progressPercentage = 0;

    @Column(length = 50)
    private String priority = "Medium";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @Column(name = "deletion_status", nullable = false)
    private int deletionStatus = 0;

    // 更新時にタイムスタンプを更新する
    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
