package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.AuthRequest;
import com.example.demo.security.CustomUserDetails;
import com.example.demo.security.CustomUserDetailsService;
import com.example.demo.security.JwtTokenUtil;

@Service
public class AuthService {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String authenticate(AuthRequest authRequest) {
    	UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());

        if (passwordEncoder.matches(authRequest.getPassword(), userDetails.getPassword())) {
        	return jwtTokenUtil.generateToken(userDetails);
        } else {
            return null;
        }
    }
    
    public Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            return userDetails.getId();  // カスタムユーザーIDを返す
        }
        return null;  // 認証されていない場合
    }
}
