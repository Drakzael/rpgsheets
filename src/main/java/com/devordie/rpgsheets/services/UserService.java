package com.devordie.rpgsheets.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.devordie.rpgsheets.entities.User;
import com.devordie.rpgsheets.repository.UserRepository;

@Service
public class UserService {
  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public List<User> allUsers() {
    return userRepository.findAll();
  }

  public User findByUsename(String username) {
    return allUsers().stream().filter(user -> user.getUsername().equals(username)).findFirst().orElseGet(null);
  }
}
