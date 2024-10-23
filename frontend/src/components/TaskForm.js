import React, { useState, useEffect } from 'react';
import { Button,Typography,Box,TextField,Select,
    MenuItem,InputLabel,FormControl,OutlinedInput } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';


const TaskForm = ({task, users, onSave}) => {

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

    useEffect(() => {
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
        }
    },[task]);


    //タスクを保存する
    const saveTask = (e) => {
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
        onSave(e, taskData);
    };
    

    return (
        <>
            {/* モーダル */}
            <Box component="form" onSubmit={saveTask}>
                <Typography id="modal-title" variant="h6" component="h2">
                    タスク更新
                </Typography>
                <Box sx={{m:1}}>
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
        </>
    );

};


export default TaskForm;