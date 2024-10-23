import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode'
import { useNavigate, Link } from 'react-router-dom'

const Home = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();  // ページ遷移に使う

  useEffect(() => {
    // ローカルストレージからトークンを取得
    const token = localStorage.getItem('token');
    if (token) {
        // トークンをデコードしてユーザー名を取得
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.sub);  // 'sub' はトークン内のユーザー名が入っているキー
    } else {
        navigate('/');  // トークンがない場合、ログインページにリダイレクト
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');  // ローカルストレージからトークンを削除
    navigate('/');  // ログインページにリダイレクト
  };

  return (
    <div>
        <h1>Welcome, {username}!</h1>
        <nav>
            <p><Link to="/taskmanager">Go to Task Table</Link></p>
        </nav>
        <button onClick={handleLogout}>logout</button>
    </div>
  );
};

export default Home;
