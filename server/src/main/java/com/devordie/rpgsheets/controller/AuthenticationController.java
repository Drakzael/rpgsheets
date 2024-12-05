package com.devordie.rpgsheets.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devordie.rpgsheets.entities.Login;
import com.devordie.rpgsheets.entities.LoginResponse;
import com.devordie.rpgsheets.entities.User;
import com.devordie.rpgsheets.entities.UserResponse;
import com.devordie.rpgsheets.services.AuthenticationService;
import com.devordie.rpgsheets.services.JwtService;
import com.devordie.rpgsheets.services.UserService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("api/auth")
public class AuthenticationController {

  private final AuthenticationService authenticationService;
  private final UserService userService;
  private final JwtService jwtService;

  public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService, UserService userService) {
    this.jwtService = jwtService;
    this.authenticationService = authenticationService;
    this.userService = userService;
  }

  @GetMapping("")
  public UserResponse getUserMe() {
    final User user = userService.getCurrentUser();
    return new UserResponse()
        .setUsername(user.getUsername())
        .setAlias(user.getAlias())
        .setRoles(user.getRoles());
  }

  @PostMapping("")
  public LoginResponse authenticate(@RequestBody Login login) {
    final User authenticatedUser = authenticationService.authenticate(login);
    final String jwtToken = jwtService.generateToken(authenticatedUser);

    return new LoginResponse()
        .setToken(jwtToken)
        .setExpiresIn(jwtService.getExpirationTime());
  }
}
