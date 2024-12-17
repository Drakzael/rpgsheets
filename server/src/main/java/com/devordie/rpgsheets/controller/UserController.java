package com.devordie.rpgsheets.controller;

import java.util.List;

import com.devordie.rpgsheets.entities.User;
import com.devordie.rpgsheets.entities.UserResponse;
import com.devordie.rpgsheets.services.UserService;
import com.fasterxml.jackson.databind.JsonNode;

import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("api/users")
@Authenticated
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class UserController {

  @Inject
  private UserService userService;

  @GET
  public List<UserResponse> listUsers() {
    return userService.allUsers().stream()
        .map(user -> new UserResponse()
            .setUsername(user.getUsername())
            .setAlias(user.getAlias()))
        .toList();
  }

  @GET
  @Path("{username}")
  public UserResponse getUser(String username) {
    final User user = userService.findByUsername(username);
    return new UserResponse()
        .setUsername(user.getUsername())
        .setAlias(user.getAlias())
        .setRoles(user.getRoles());
  }

  @POST
  public String addUser(UserResponse user) {
    return userService.createUser(new User()
        .setUsername(user.getUsername())
        .setAlias(user.getAlias())
        .setRoles(user.getRoles()));
  }

  @PUT
  @Path("{username}")
  public void updateUser(String username, UserResponse user) {
    userService.updateUser(new User()
        .setUsername(user.getUsername())
        .setAlias(user.getAlias())
        .setRoles(user.getRoles()));
  }

  @PUT
  @Path("{username}/password")
  public void updatePassword(String username, JsonNode password) {
    userService.updatePassword(username, password.get("oldPassword").asText(), password.get("newPassword").asText());
  }

  @DELETE
  @Path("{username}")
  public void deleteUser(String username) {
    userService.deleteUser(username);
  }
}
