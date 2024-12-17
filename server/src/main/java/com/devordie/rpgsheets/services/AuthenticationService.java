package com.devordie.rpgsheets.services;

import com.devordie.rpgsheets.entities.Login;
import com.devordie.rpgsheets.entities.User;
import com.devordie.rpgsheets.repository.UserRepository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class AuthenticationService {

  @Inject
  private UserRepository userRepository;

  @Inject
  private UserService userService;

  public User authenticate(Login login) {
    final User user = userRepository.findByUsername(login.username()).orElse(null);
    if (user != null) {
      if (userService.checkPassword(login.password(), user.getPassword())) {
        return user;
      }
    }
    throw new IllegalStateException();
  }
}
