package com.devordie.rpgsheets.controller;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.devordie.rpgsheets.entities.Login;
import com.devordie.rpgsheets.entities.LoginResponse;
import com.devordie.rpgsheets.entities.User;
import com.devordie.rpgsheets.entities.UserResponse;
import com.devordie.rpgsheets.services.AuthenticationService;
import com.devordie.rpgsheets.services.JwtService;
import com.devordie.rpgsheets.services.UserService;

import io.quarkus.security.Authenticated;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("api/auth")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AuthenticationController {

  private static final Log LOGGER = LogFactory.getLog(AuthenticationController.class);

  @Inject
  private AuthenticationService authenticationService;

  @Inject
  private UserService userService;

  @Inject
  private JwtService jwtService;

  @GET
  @Authenticated
  public UserResponse getUserMe() {
    final User user = userService.getCurrentUser();
    LOGGER.debug("Access to self user information.");
    return new UserResponse()
        .setUsername(user.getUsername())
        .setAlias(user.getAlias())
        .setRoles(user.getRoles());
  }

  @POST
  @PermitAll
  public LoginResponse authenticate(Login login) {
    LOGGER.info("Authenticating user " + login.username());
    final User authenticatedUser = authenticationService.authenticate(login);
    final String jwtToken = jwtService.generateToken(authenticatedUser);

    return new LoginResponse()
        .setToken(jwtToken)
        .setExpiresIn(jwtService.getExpirationTime());
  }

  @GET
  @Authenticated
  @Path("me")
  @Deprecated
  public UserResponse getMeDeprecated() {
    return getUserMe();
  }

  @POST
  @PermitAll
  @Path("login")
  @Deprecated
  public LoginResponse authenticateDeprecate(Login login) {
    return authenticate(login);
  }
}
