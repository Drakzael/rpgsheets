package com.devordie.rpgsheets.services;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

  public User findByUsername(String username) {
    return allUsers().stream().filter(user -> user.getUsername().equals(username)).findFirst().orElseGet(null);
  }

  public User getCurrentUser() {
    Authentication authenticationToken = SecurityContextHolder.getContext().getAuthentication();
    return (User) authenticationToken.getPrincipal();
  }
}
