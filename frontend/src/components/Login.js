// import axios from 'axios';
import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../axios';
import { Box, Button, TextField, Typography } from '@mui/material';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // ローカルストレージからトークンを削除
    localStorage.removeItem('token');
  })

  const handleLogin = async () => {
    try {
      // ログインエンドポイントにリクエストを送信
      const response = await axiosInstance.post('/auth/login', {
        username,
        password,
      },
      {
        headers: {
          // リクエストがJSON形式であることを指定
          'Content-Type': 'application/json'
        }
      });
      
      // バックエンドのレスポンスから JWT トークンを取得
      const token = response.data.token;  // token というフィールドに合わせる
      localStorage.setItem('token', token);  // トークンをローカルストレージに保存

      // ログイン成功後にホームページに遷移
      navigate('/home');

    } catch (error) {
      alert('Login failed!');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: 2,
        bgcolor: '#f5f5f5',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Username"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        margin="normal"
      />
      <TextField
        type="password"
        label="Password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
      />
      <Button 
        onClick={handleLogin}
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >Login
      </Button>
    </Box>
  );
};

export default Login;
