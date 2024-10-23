import React, { useEffect, useState } from 'react';
import { Table,TableBody,TableCell,TableContainer,TableHead,
        TableRow,Paper,Tooltip,IconButton,Checkbox } from '@mui/material';
import { Delete } from '@mui/icons-material';

const TaskTable = ({onEdit,onTrash,tasks,trashedFlg,selectedIds, onSelectTask, onSelectAllTasks}) => {
    
    // 現在ホバーしている行を管理
    const [hoveredRow, setHoveredRow] = useState(null);
    const [areAllSelected,setAreAllSelected] = useState(false);
    useEffect(()  => {
        if(trashedFlg) {
            //チェックをすべてしているかの管理
            setAreAllSelected(selectedIds.length === tasks.length && tasks.length > 0); 
        }
    },[selectedIds, tasks, trashedFlg]);
    
    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="task table">
                    <TableHead>
                    <TableRow>
                        {trashedFlg &&(
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selectedIds.length > 0 && !areAllSelected}
                                    checked={areAllSelected}
                                    onChange={(e) => onSelectAllTasks(e.target.checked)}
                                />
                            </TableCell>
                        )}
                        <TableCell>タスク名</TableCell>
                        <TableCell align="right">優先度</TableCell>
                        <TableCell align="right">ステータス</TableCell>
                        <TableCell align="right">開始予定日</TableCell>
                        <TableCell align="right">完了予定日</TableCell>
                        <TableCell align="right">完了日</TableCell>
                        <TableCell align="right">進捗 (%)</TableCell>
                        {!trashedFlg && (
                            <TableCell align="center">ゴミ箱</TableCell>
                        )}
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow
                                key={task.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                onMouseEnter={() => setHoveredRow(task.id)}  // マウスが入ったとき
                                onMouseLeave={() => setHoveredRow(null)}  // マウスが出たとき
                                onClick={!trashedFlg ? () => onEdit(task) : null} //行クリックで更新モーダル表示
                                
                            >
                            {trashedFlg && (
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedIds.includes(task.id)}
                                        onChange={() => onSelectTask(task.id)}
                                    />
                                </TableCell>    
                            )}
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
                            {!trashedFlg && (
                                <TableCell align="center">
                                    <IconButton onClick={(e) => onTrash(e,task)} aria-label="delete" size="large" sx={{p:0}}>
                                        <Delete/>
                                    </IconButton>
                                </TableCell>
                            )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default TaskTable;
