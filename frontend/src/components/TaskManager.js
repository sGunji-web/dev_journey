import React, { useState,useEffect } from 'react';
import TaskTable from './TaskTable';
import TaskForm from './TaskForm';
import Modal from './Modal';
import axiosInstance from '../axios';
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material';
import { Delete,AddCircle,Reply } from '@mui/icons-material';

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    // const isMounted = useRef(false);
    
    // ページ遷移
    const navigate = useNavigate();

    //タスク一覧の取得イベント
    const fetchTasks = async () => {
        console.log('fetchTasks!');
        try {
            const response = await axiosInstance.get('/api/progress/list');
            setTasks(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    //ユーザー一覧の取得
    const fetchUsers = async () => {
        console.log('fetchUsers!');
        try {
          const response = await axiosInstance.get('/api/progress/getUsers');
          setUsers(response.data);   
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
    };

    // タスクの登録・更新
    const handleSave  = async (e, taskData) => {
        console.log('handleSave:' + taskData);
        e.preventDefault();
        try {
            // POSTリクエストを送信（インターセプターが自動的にJWTトークンを追加）
            const response = await axiosInstance.post('/api/progress/save', taskData);

            alert('タスクが登録されました:', response.data);
            // モーダルを閉じる
            setIsModalOpen(false);
            //タスクを初期化
            setTask(null);
            // タスク一覧更新
            await fetchTasks();
        } catch (error) {
            alert('タスク登録エラー:', error);
        }
    };

    // 新しいタスクを追加する処理
    const handleAddNew = () => {
        setTask(null);
        setIsModalOpen(true); // モーダルを開く
    };

    // 編集対象のタスクを選択してモーダルを開く
    const handleEdit = (task) => {
        setTask(task);
        setIsModalOpen(true); // モーダルを開く
    };

    // タスクをごみ箱に移動
    const handleTrash = async (e, task) => {
        e.stopPropagation();
        console.log(task);
        const shouldTrash = window.confirm('タスクをごみ箱に移動しますか？\nタスク名：' + task.taskName);
        if (shouldTrash) {
            console.log('ごみ箱に移動しました');
            try {
                // POSTリクエストを送信（インターセプターが自動的にJWTトークンを追加）
                const response = await axiosInstance.post('/api/progress/trash', task);
                if (response.data.success) {
                    alert('タスクをごみ箱に移動しました');
                  } else {
                    alert('削除ステータスの更新に失敗しました: ' + response.data.message);
                  }
                // タスク一覧更新
                await fetchTasks();
            } catch (error) {
                console.error('Error updating deletion status:', error);
                alert('削除ステータスの更新中にエラーが発生しました');
            }
        }
    };
    
    useEffect(() => {
        fetchTasks();
        fetchUsers();
        // console.log(isMounted.current);
        // if (!isMounted.current) {
        //     console.log('fetch!');
        //     isMounted.current = true; // 初回マウント時にフラグを立てる
        //     fetchTasks();
        //     // fetchUsers();
        // }
    }, []);

    return (
        <>
            <Button onClick={handleAddNew} 
                variant='contained' sx={{m:1}} startIcon={<AddCircle />}>タスク追加
            </Button>
            <Button 
                onClick={() => navigate('/trashedTaskManager')}
                variant='contained' color='secondary' sx={{m:1}} startIcon={<Delete />}>ごみ箱
            </Button>
            <Button 
                onClick={() => navigate('/home')} 
                variant='contained' color='default' sx={{m:1}} startIcon={<Reply />}>戻る
            </Button>
            <TaskTable tasks={tasks}  onEdit={handleEdit}  onTrash={handleTrash} trashedFlg={false} />
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <TaskForm task={task} users={users} onSave={handleSave} />
            </Modal>
        </>
    );
};

export default TaskManager;