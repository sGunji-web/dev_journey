package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

@Service
public class UserService {

	@Autowired
    private UserRepository userRepository;

	@Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();  // 全ユーザーを取得
    }

}
