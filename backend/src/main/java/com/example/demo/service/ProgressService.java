package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.Progress;
import com.example.demo.repository.ProgressRepository;
import com.example.demo.security.CustomUserDetails;

@Service
public class ProgressService {

	@Autowired
	private ProgressRepository progressRepository;

	@Autowired
	private UserDetailsService userDetailsService;

	// 特定のユーザーIDのタスクを取得する
	@Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = true)
	public List<Progress> getProgressByUserId() {
		// 認証済みのユーザーIDを取得
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null) {
			//ユーザーIDを取得
			String username = authentication.getName();// ユーザー名を取得
			CustomUserDetails userDetails = (CustomUserDetails) userDetailsService.loadUserByUsername(username);//ユーザー情報を取得
			// 検索対象のstatusを定義
			List<String> statuses = new ArrayList<>();
			statuses.add("Not Started");
			statuses.add("In Progress");
			statuses.add("Completed");
			
			return progressRepository.findByAssignedUserAndStatusInAndDeletionStatus(userDetails.getId(), statuses,0);
		}
		return null;
	}

	// タスクを作成・更新する
	@Transactional
	public Progress saveProgress(Progress progress) {
		Progress saveEntity;
		if (progress.getId() != null) {
			Optional<Progress> existingEntity = progressRepository.findById(progress.getId());
			if (existingEntity.isPresent()) {
				// 既存エンティティを取得
				saveEntity = existingEntity.get();
				// IDやcreatedAtなど変更したくないフィールド以外をコピー
				BeanUtils.copyProperties(progress, saveEntity, "id", "createdAt");
				// 更新日を設定
				saveEntity.setUpdatedAt(LocalDateTime.now());
				//BeanUtilsを使用することでentityへの設定の記述を省略可能
				// 更新
				return progressRepository.save(saveEntity);
			}
		}
		// 新規作成もしくはIDが存在しない場合
		saveEntity = progress;
		saveEntity.setCreatedAt(LocalDateTime.now());
		return progressRepository.save(saveEntity);
	}

	// 共通部分：IDに基づいてProgressを取得する
	@Transactional
	private Optional<Progress> findProgressById(UUID id) {
		return progressRepository.findById(id);
	}

	// ゴミ箱に移動するメソッド
	@Transactional
	public boolean moveToTrash(UUID id) {
		return updateDeletionStatus(id, 1); // フラグ1に設定
	}

	// ゴミ箱から復元するメソッド
	@Transactional
	public boolean restore(UUID id) {
		return updateDeletionStatus(id, 0); // フラグ0に設定
	}

	// 削除フラグの更新（共通処理）
	@Transactional
	private boolean updateDeletionStatus(UUID id, int deletionStatus) {
		Optional<Progress> existingProgressOpt = findProgressById(id);
		if (existingProgressOpt.isPresent()) {
			Progress saveProgress = existingProgressOpt.get();
			saveProgress.setDeletionStatus(deletionStatus);
			// 更新日を設定
			saveProgress.setUpdatedAt(LocalDateTime.now());
			progressRepository.save(saveProgress);
			return true;
		}
		return false;
	}
	
	// 特定のユーザーIDのごみ箱タスクを取得する
	@Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = true)
	public List<Progress> getProgressTrashedByUserId() {
		// 認証済みのユーザーIDを取得
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null) {
			//ユーザーIDを取得
			String username = authentication.getName();// ユーザー名を取得
			CustomUserDetails userDetails = (CustomUserDetails) userDetailsService.loadUserByUsername(username);//ユーザー情報を取得
			// 検索対象のstatusを定義
			List<String> statuses = new ArrayList<>();
			statuses.add("Not Started");
			statuses.add("In Progress");
			statuses.add("Completed");
			
			return progressRepository.findByAssignedUserAndStatusInAndDeletionStatus(userDetails.getId(), statuses,1);
		}
		return null;
	}
	
	// 完全削除するメソッド
	@Transactional
	public void permanentlyDelete(Iterable<? extends UUID> taskIdList) {
		 progressRepository.deleteAllById(taskIdList);
	}
}
