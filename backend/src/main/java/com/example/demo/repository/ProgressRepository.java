package com.example.demo.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Progress;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, UUID> {
	// Userエンティティのidに基づいてProgressを検索する
    List<Progress> findByAssignedUserAndStatusInAndDeletionStatus(Long assignedUser,List<String> statuses, int deletionStatus);
}