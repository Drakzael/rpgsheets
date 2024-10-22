package com.devordie.rpgsheets.services;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.devordie.rpgsheets.entities.Login;
import com.devordie.rpgsheets.entities.User;
import com.devordie.rpgsheets.repository.UserRepository;

@Service
public class AuthenticationService {
  private final UserRepository userRepository;
  private final AuthenticationManager authenticationManager;

  public AuthenticationService(
      UserRepository userRepository,
      AuthenticationManager authenticationManager) {
    this.userRepository = userRepository;
    this.authenticationManager = authenticationManager;
  }

  public User authenticate(Login login) {
    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(login.username(), login.password()));
    return userRepository.findByUsername(login.username()).orElseThrow();
  }
}
