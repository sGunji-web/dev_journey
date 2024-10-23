package com.example.demo.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Progress;
import com.example.demo.entity.User;
import com.example.demo.service.ProgressService;
import com.example.demo.service.UserService;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

	@Autowired
	private ProgressService progressService;

	@Autowired
	private UserService userService;

	// IDで特定のタスクを取得
	@GetMapping("/list")
	public List<Progress> getProgressByUserId() {
		return progressService.getProgressByUserId();
	}

	// タスク追加画面を表示（担当者一覧を取得）
	@GetMapping("/getUsers")
	public List<User> getUsers() {
		//userServiceの呼び出し
		List<User> users = userService.getAllUsers();
		return users;
	}

	// タスクを作成・更新する
	@PostMapping("/save")
	public Progress saveProgress(@RequestBody Progress progress) {
		return progressService.saveProgress(progress);
	}

	//　タスクをゴミ箱に移動
	@PostMapping("/trash")
	public ResponseEntity<?> trashTask(@RequestBody Progress progress) {
		
		try {
			// 削除フラグの更新処理を行う
			boolean isUpdated = progressService.moveToTrash(progress.getId());

			if (isUpdated) {
				// 成功時のレスポンス
				return ResponseEntity.ok().body(Map.of("success", true, "message", "削除ステータスが正常に更新されました"));
			} else {
				// エラー時のレスポンス
				return ResponseEntity.status(500)
						.body(Map.of("success", false, "message", "指定されたIDのタスクが見つかりませんでした"));
			}
		} catch (IllegalArgumentException e) {
	        // 入力データに問題がある場合
	        return ResponseEntity.status(400)
	                .body(Map.of("success", false, "message", "入力データエラー: " + e.getMessage()));
	    } catch (DataAccessException e) {
	        // データベース関連の問題が発生した場合
	        return ResponseEntity.status(500)
	                .body(Map.of("success", false, "message", "データベースエラー: " + e.getMessage()));
	    } catch (Exception e) {
	        // その他の予期しないエラー
	        return ResponseEntity.status(500)
	                .body(Map.of("success", false, "message", "その他予期しないエラー: " + e.getMessage()));
	    }

	}
	
	// IDで特定のごみ箱タスクを取得
	@GetMapping("/trashedTaskList")
	public List<Progress> getTrashedProgressByUserId() {
		return progressService.getProgressTrashedByUserId();
	}
	
	@PostMapping("/delete")
	public ResponseEntity<?> deleteProgress(@RequestBody Iterable<? extends UUID> taskIdList) {
		try {
			progressService.permanentlyDelete(taskIdList);
			// 成功時のレスポンス
			return ResponseEntity.ok().body(Map.of("success", true, "message", "正常に削除されました"));
		} catch (IllegalArgumentException e) {
	        // 入力データに問題がある場合
	        return ResponseEntity.status(400)
	                .body(Map.of("success", false, "message", "入力データエラー: " + e.getMessage()));
	    } catch (DataAccessException e) {
	        // データベース関連の問題が発生した場合
	        return ResponseEntity.status(500)
	                .body(Map.of("success", false, "message", "データベースエラー: " + e.getMessage()));
	    } catch (Exception e) {
	        // その他の予期しないエラー
	        return ResponseEntity.status(500)
	                .body(Map.of("success", false, "message", "その他予期しないエラー: " + e.getMessage()));
	    }	
	}

	//
	//    // タスクを削除
	//    @DeleteMapping("/{id}")
	//    public void deleteProgress(@PathVariable UUID id) {
	//        progressService.deleteProgress(id);
	//    }
}
