package com.example.demo.dto;

public class AuthResponse {

    private String token;
    private String message;

    // 成功時のコンストラクタ（トークンを受け取る）
    public AuthResponse(String token, boolean success) {
        this.token = token;
        this.message = success ? "Login successful" : null;
    }

    // 失敗時のコンストラクタ（メッセージを受け取る）
    public AuthResponse(String message) {
        this.message = message;
        this.token = null;  // 失敗時はトークンをnullにする
    }

    // GetterとSetter
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
