import axios from 'axios';


// トークンをローカルストレージから取得し、グローバル設定に反映
const token = localStorage.getItem('token');
if (token) {
  // グローバルにAuthorizationヘッダーを設定
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Axiosインスタンスを作成
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',  // ベースとなるURL
});

// リクエストのインターセプターを追加
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('リクエストインターセプター実行');
    const token = localStorage.getItem('token');  // ローカルストレージからトークンを取得
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;  // トークンが存在すれば、ヘッダーに追加
      // axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
    }
    return config;
  },
  (error) => {
    console.error('リクエストインターセプターでエラー:', error);
    return Promise.reject(error);
  }
);

// エラーハンドリング（認証エラーに対応）
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      console.error('認証エラーです: 再ログインが必要かもしれません。');
      // 必要に応じて、ユーザーをログアウトさせたりログインページにリダイレクトしたりする処理を追加
      //localStorage.removeItem('token');
      // window.location.href = '/'; // ログインページにリダイレクト（必要なら）
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;  // 設定したインスタンスをエクスポート
