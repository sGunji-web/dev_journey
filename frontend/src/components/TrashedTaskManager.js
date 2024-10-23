import React, { useState,useEffect } from 'react';
import TaskTable from './TaskTable';
import axiosInstance from '../axios';
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material';
import { Reply,Delete } from '@mui/icons-material';

const TrashedTaskManager = () => {
    const [tasks, setTasks] = useState([]);
    // 選択されたタスクのIDを管理
    const [selectedIds, setSelectedIds] = useState([]);
    
    // ページ遷移
    const navigate = useNavigate();

    //ごみ箱タスク一覧の取得イベント
    const fetchTrashedTasks = async () => {
        try {
        const response = await axiosInstance.get('/api/progress/trashedTaskList');
        setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // 個別のタスクのチェックボックスを選択/解除する処理
    const handleSelectTask = (taskId) => {
        if (selectedIds.includes(taskId)) {
        setSelectedIds(selectedIds.filter(id => id !== taskId)); // 解除
        } else {
        setSelectedIds([...selectedIds, taskId]); // 追加
        }
    };

    // 全てのチェックボックスを選択/解除する処理
    const handleSelectAllTasks = (isChecked) => {
        if (isChecked) {
        setSelectedIds(tasks.map(task => task.id)); // 全て選択
        } else {
        setSelectedIds([]); // 全て解除
        }
    };

    // タスクをごみ箱に移動
    const handleDelete = async (e, selectedIds) => {
        e.stopPropagation();
        console.log(selectedIds);
        const shouldDelete = window.confirm('タスクを一括削除しますか？\n一度削除したタスクは元に戻せません');
        if (shouldDelete) {
            console.log('削除しました');
            try {
                // POSTリクエストを送信（インターセプターが自動的にJWTトークンを追加）
                const response = await axiosInstance.post('/api/progress/delete', selectedIds);
                if (response.data.success) {
                    alert('タスクを削除しました');
                  } else {
                    alert('物理削除に失敗しました: ' + response.data.message);
                  }
                // タスク一覧更新
                await fetchTrashedTasks();
                setSelectedIds([]);
            } catch (error) {
                console.error('Error updating deletion status:', error);
                alert('削除処理中にADMINエラーが発生しました');
            }
        } else {
            console.log('削除失敗');
        }
    };

    useEffect(() => {
        fetchTrashedTasks();
    }, []);

    return (
        <>
            <Button 
                onClick={(e) => handleDelete(e,selectedIds)} 
                variant='contained' color='error' sx={{m:1}} startIcon={<Delete />}>一括削除
            </Button>
            <Button 
                onClick={() => navigate('/taskmanager')} 
                variant='contained' color='default' sx={{m:1}} startIcon={<Reply />}>戻る
            </Button>
            <TaskTable 
                tasks={tasks} 
                trashedFlg={true} 
                selectedIds={selectedIds} 
                onSelectTask={handleSelectTask}
                onSelectAllTasks={handleSelectAllTasks}
            />
        </>
    );
};

export default TrashedTaskManager;