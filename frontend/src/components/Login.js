// import axios from 'axios';
import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../axios';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  // ページ遷移に使う

  useEffect(() => {
    localStorage.removeItem('token');  // ローカルストレージからトークンを削除
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
          'Content-Type': 'application/json'  // リクエストがJSON形式であることを指定
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
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
