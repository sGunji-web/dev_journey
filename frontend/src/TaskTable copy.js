import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
// import axios from 'axios';
import axiosInstance from './axios'; 
// import {jwtDecode} from 'jwt-decode'
import { Button,Table,TableBody,TableCell,TableContainer,TableHead,
        TableRow,Paper,Typography,Tooltip,Modal,Box,TextField,Select,
        MenuItem,InputLabel,FormControl,OutlinedInput,IconButton } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Delete,AddCircle,Reply } from '@mui/icons-material';
import dayjs from 'dayjs';

const TaskTable = () => {
    
    //タスク一覧
    const [tasks, setTasks] = useState([]);
    // 現在ホバーしている行を管理
    const [hoveredRow, setHoveredRow] = useState(null);
    // モーダルの開閉状態
    const [open, setOpen] = useState(false);
    // 選択されたタスク
    // ユーザー一覧
    const [users, setUsers] = useState([]);
    // モーダルのフォーム
    const [id, setId] = useState("");
    const [taskName, setTaskName] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("");
    const [status, setStatus] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [completedAt, setCompletedAt] = useState(null);
    const [assignedUser, setAssignedUser] = useState(0);
    const [progressPercentage, setProgressPercentage] = useState(0);
    // ページ遷移
    const navigate = useNavigate();

    //タスク一覧の取得イベント
    const fetchTasks = async () => {
        try {
        const response = await axiosInstance.get('/api/progress/list');
        setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        //タスク一覧の取得
        fetchTasks();
    }, []);

    //ユーザー一覧の取得
    const fetchUsers = async () => {
        try {
          const response = await axiosInstance.get('/api/progress/getUsers');
          setUsers(response.data);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
    };

    // タスクの登録・更新
    const updateTask = async (e) => {
        e.preventDefault();

        // フォームデータをオブジェクトとして作成
        const taskData = {
            id,
            taskName,
            description,
            priority, 
            status, 
            startDate, 
            endDate, 
            completedAt,
            assignedUser, 
            progressPercentage, 
        };
        console.log(taskData);

        try {
            // POSTリクエストを送信（インターセプターが自動的にJWTトークンを追加）
            const response = await axiosInstance.post('/api/progress/save', taskData);

            alert('タスクが登録されました:', response.data);
            // モーダルを閉じる
            setOpen(false);
            // タスク一覧更新
            await fetchTasks();
        } catch (error) {
            alert('タスク登録エラー:', error);
        }
    };

    // モーダルを開く
    const handleOpen = async (task) => {
        console.log(task);
        if (task !== null) {
            // クリックした行のタスクを設定
            setId(task.id);
            setTaskName(task.taskName);
            setDescription(task.description);
            setPriority(task.priority);
            setStatus(task.status);
            setStartDate(task.startDate);
            setEndDate(task.endDate);
            setCompletedAt(task.completedAt);
            setAssignedUser(task.assignedUser);
            if(task.progressPercentage !== null) {
                setProgressPercentage(task.progressPercentage);
            }
        } else {
            setId("");
            setTaskName("");
            setDescription("");
            setPriority("High");
            setStatus("Not Started");
            setStartDate(null);
            setEndDate(null);
            setCompletedAt(null);
            setAssignedUser(0);
            setProgressPercentage(0);
            console.log(priority);
        }

        //ユーザー一覧取得
        await fetchUsers();
        
        //モーダルを開く
        setOpen(true);
    };

    // モーダルを閉じる
    const handleClose = () => setOpen(false);

    //更新モーダルのスタイル
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',  // 中央に配置
        width: 400,
        bgcolor: 'background.paper',  // 背景色を適用
        border: '2px solid #000',  // ボーダー
        boxShadow: 24,  // 影の強さ
        p: 4,  // パディング
        maxHeight: '80vh',  // 最大高さを設定
        overflow: 'auto',    // コンテンツが多すぎる場合にスクロール可能にする
    };

    // タスクをゴミ箱に移動
    const moveToTrash = async (e, task) => {
        e.stopPropagation();
        console.log(task);
        const shouldTrash = window.confirm('タスクをゴミ箱に移動しますか？\nタスク名：' + task.taskName);
        if (shouldTrash) {
            console.log('ゴミ箱に移動しました');
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

    return (
        <>
            <Button onClick={() => handleOpen(null)} variant='contained' sx={{m:1}} startIcon={<AddCircle />}>タスク追加</Button>
            <Button variant='contained'  color='secondary' sx={{m:1}} startIcon={<Delete />}>ごみ箱</Button>
            <Button onClick={() => navigate('/home')} variant='contained' color='default' sx={{m:1}} startIcon={<Reply />}>戻る</Button>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="task table">
                    <TableHead>
                    <TableRow>
                        <TableCell>タスク名</TableCell>
                        <TableCell align="right">優先度</TableCell>
                        <TableCell align="right">ステータス</TableCell>
                        <TableCell align="right">開始予定日</TableCell>
                        <TableCell align="right">完了予定日</TableCell>
                        <TableCell align="right">完了日</TableCell>
                        <TableCell align="right">進捗 (%)</TableCell>
                        <TableCell align="center">ゴミ箱</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow
                                key={task.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                onMouseEnter={() => setHoveredRow(task.id)}  // マウスが入ったとき
                                onMouseLeave={() => setHoveredRow(null)}  // マウスが出たとき
                                onClick={() => handleOpen(task)} //行クリックで更新モーダル表示
                            >
                            <TableCell component="th" scope="row">
                                <Tooltip
                                    key={task.id}
                                    title={task.description}
                                    placement="top"
                                    arrow
                                    open={hoveredRow === task.id}
                                > 
                                    <span>{task.taskName}</span>
                                </Tooltip>
                            </TableCell>
                            <TableCell align="right">
                                {task.priority === "High"
                                    ? "高"
                                    : task.priority === "Medium"
                                    ? "中"
                                    : task.priority === "Low"
                                    ? "低"
                                    : "未設定"
                                }
                            </TableCell>
                            <TableCell align="right">
                                {task.status === "Not Started"
                                    ? "未着手"
                                    : task.status === "In Progress"
                                    ? "実施中"
                                    : task.status === "Completed"
                                    ? "完了"
                                    : "未設定"
                                }
                            </TableCell>
                            <TableCell align="right">{task.startDate}</TableCell>
                            <TableCell align="right">{task.endDate}</TableCell>
                            <TableCell align="right">{task.completedAt}</TableCell>
                            <TableCell align="right">{task.progressPercentage}%</TableCell>
                            {/* ゴミ箱移動 */}
                            <TableCell align="center">
                                <IconButton onClick={(e) => moveToTrash(e,task)} aria-label="delete" size="large" sx={{p:0}}>
                                    <Delete/>
                                </IconButton>
                            </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    
                    {/* モーダル */}
                    <Modal
                        open={open}
                        onClose={handleClose}
                    >
                        {/* Box:htmlにおけるdivに近いもの。スタイルをつけないと何も表示しない */}
                        <Box component="form" onSubmit={updateTask} sx={style}>
                            <Typography id="modal-title" variant="h6" component="h2">
                                タスク更新
                            </Typography>
                            <Box sx={{m:1}}>
                                {/* variant:htmlのスタイルを設定できる */}
                                {/* sx:スタイルを設定するためのスタイルプロパティ */}
                                {/* mt:2 マージントップが2px */}
                                {/* タスク名 */}
                                <TextField 
                                    required 
                                    id="taskName" 
                                    label="タスク名" 
                                    value={taskName} 
                                    onChange={(e) => setTaskName(e.target.value)}
                                    sx={{mt: 2}}
                                    fullWidth
                                />
                                {/* 説明 */}
                                <TextField 
                                    id="description"
                                    label="説明"
                                    multiline
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    sx={{mt: 2}}
                                    fullWidth
                                />
                                {/* 担当者 */}
                                <FormControl variant="outlined" fullWidth sx={{ mt: 2 }}>
                                    <InputLabel shrink htmlFor="assignedUser-select">担当者</InputLabel>
                                    <Select
                                        input={<OutlinedInput notched label="担当者" id="assignedUser-select" />}
                                        value={assignedUser}
                                        onChange={(e) => {
                                            const selectedValue = e.target.value;
                                            setAssignedUser(selectedValue);
                                        }}
                                        required
                                    >
                                        <MenuItem value={0}>未設定</MenuItem>
                                        {users.length === 0 ? (
                                            <MenuItem disabled>データがありません</MenuItem>
                                        ) : (
                                            users.map((user) => (
                                            <MenuItem key={user.id} value={user.id}>{user.username}</MenuItem>
                                            ))
                                        )}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Box sx={{flex: 2, m:1}}>
                                    {/* 優先度 */}
                                    <FormControl variant="outlined" fullWidth sx={{mt: 2}}>
                                        <InputLabel shrink htmlFor="priority-select">
                                            優先度
                                        </InputLabel>
                                        <Select
                                            input={<OutlinedInput notched label="優先度" id="priority-select" />}
                                            value={priority}
                                            onChange={(e) => setPriority(e.target.value)}
                                            required
                                            defaultValue=""
                                        >
                                            <MenuItem value={""}>未設定</MenuItem>
                                            <MenuItem value={"High"}>高</MenuItem>
                                            <MenuItem value={"Medium"}>中</MenuItem>
                                            <MenuItem value={"Low"}>低</MenuItem>
                                        </Select>
                                    </FormControl>
                                    {/* ステータス */}
                                    <br/>
                                    <FormControl variant="outlined" sx={{mt: 2}} fullWidth>
                                        <InputLabel shrink htmlFor="status-select">
                                            ステータス
                                        </InputLabel>
                                        <Select
                                            input={<OutlinedInput notched label="ステータス" id="status-select" />}
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            required
                                        >
                                            <MenuItem value={""}>未設定</MenuItem>
                                            <MenuItem value={"Not Started"}>未着手</MenuItem>
                                            <MenuItem value={"In Progress"}>実施中</MenuItem>
                                            <MenuItem value={"Completed"}>完了</MenuItem>
                                        </Select>
                                    </FormControl>
                                    {/* 進捗(%) */}
                                    <Box>
                                        <TextField 
                                            id="progressPercentage" 
                                            label="進捗(%)" 
                                            value={progressPercentage}
                                            onChange={(e) => setProgressPercentage(e.target.value)}
                                            sx={{mt: 2}}
                                            fullWidth
                                        />
                                    </Box>
                                </Box>
                                <Box sx={{flex: 3 , m:1}}>
                                    {/* 開始予定日 */}
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="開始予定日"
                                            value={dayjs(startDate)}
                                            onChange={(e) => {
                                                const formattedDate = dayjs(e).format('YYYY-MM-DD');
                                                setStartDate(formattedDate);
                                            }}
                                            format="YYYY/MM/DD"
                                            sx={{mt: 2}}
                                        />
                                    </LocalizationProvider>
                                    {/* 完了予定日 */}
                                    <br/>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="完了予定日"
                                            value={dayjs(endDate)}
                                            onChange={(e) => {
                                                const formattedDate = dayjs(e).format('YYYY-MM-DD');
                                                setEndDate(formattedDate);
                                            }}
                                            format="YYYY/MM/DD"
                                            sx={{mt: 2}}
                                        />
                                    </LocalizationProvider>
                                    {/* 完了日 */}
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="完了日"
                                            value={dayjs(completedAt)}
                                            onChange={(e) => {
                                                const formattedDate = dayjs(e).format('YYYY-MM-DD');
                                                setCompletedAt(formattedDate);
                                            }}
                                            format="YYYY/MM/DD"
                                            sx={{mt: 2}}
                                        />
                                    </LocalizationProvider>
                                </Box>
                            </Box>
                            <Box sx={{display: 'flex', justifyContent: 'flex-end', m:1}}>
                                <Button type="submit" variant="contained" color="primary">登録</Button>
                            </Box>
                        </Box>
                    </Modal>
                </Table>
            </TableContainer>
        </>
    );
};

// export default TaskTable;
