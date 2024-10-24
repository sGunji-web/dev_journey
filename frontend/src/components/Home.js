import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box,Typography,Link,Button } from '@mui/material';

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
        <Typography variant="h3" gutterBottom>
          Welcome, {username}!
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Link component={RouterLink} to="/taskmanager" underline="hover">
            <Typography variant="h6">Go to Task Table</Typography>
          </Link>
        </Box>
        <Button 
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          sx={{ mt: 4 }}
        >logout
        </Button>
    </Box>
  );
};

export default Home;
