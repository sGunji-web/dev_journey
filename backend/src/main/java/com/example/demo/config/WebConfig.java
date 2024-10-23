package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**").allowedOrigins("http://localhost:3000");
    	 registry.addMapping("/**")  // 全てのエンドポイントに対して
         .allowedOrigins("http://localhost:3000")  // フロントエンドのURLを許可
         .allowedMethods("GET", "POST", "PUT", "DELETE")  // 必要なHTTPメソッドを指定
         .allowedHeaders("*")  // 必要なヘッダーを許可
    	 .allowCredentials(true);  // 認証情報の許可（必要なら）
    }
}
