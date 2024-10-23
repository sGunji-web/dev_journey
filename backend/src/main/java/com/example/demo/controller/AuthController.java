package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.AuthRequest;
import com.example.demo.dto.AuthResponse;
import com.example.demo.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) {
        String token = authService.authenticate(authRequest);
        
        if (token != null) {
            // トークンが存在する場合、JWTトークンを返す
            return ResponseEntity.ok(new AuthResponse(token,true));
        } else {
            // 認証失敗時にカスタムのAuthResponseを返す
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new AuthResponse("Invalid credentials"));
        }
    }
}
