import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');  // ローカルストレージからトークンを取得

  if (!token) {
    // トークンがない場合はログインページにリダイレクト
    return <Navigate to="/login" />;
  }

  // トークンがある場合は、指定されたコンポーネントを表示
  return children;
};

export default ProtectedRoute;
