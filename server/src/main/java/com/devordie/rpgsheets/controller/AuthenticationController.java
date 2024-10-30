package com.devordie.rpgsheets.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devordie.rpgsheets.entities.Login;
import com.devordie.rpgsheets.entities.LoginResponse;
import com.devordie.rpgsheets.entities.User;
import com.devordie.rpgsheets.services.AuthenticationService;
import com.devordie.rpgsheets.services.JwtService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("api/auth")
public class AuthenticationController {

  private final AuthenticationService authenticationService;
  private final JwtService jwtService;

  public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
    this.jwtService = jwtService;
    this.authenticationService = authenticationService;
  }

  @PostMapping("login")
  public ResponseEntity<LoginResponse> authenticate(@RequestBody Login login) {
    final User authenticatedUser = authenticationService.authenticate(login);
    final String jwtToken = jwtService.generateToken(authenticatedUser);

    return ResponseEntity.ok(new LoginResponse()
        .setAlias(authenticatedUser.getAlias())
        .setToken(jwtToken)
        .setExpiresIn(jwtService.getExpirationTime()));
  }
}
