package com.devordie.rpgsheets.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devordie.rpgsheets.entities.User;
import com.devordie.rpgsheets.entities.UserResponse;
import com.devordie.rpgsheets.services.UserService;
import com.fasterxml.jackson.databind.JsonNode;

@RestController
@RequestMapping("/api/users")
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping("")
  public List<UserResponse> listUsers() {
    return userService.allUsers().stream()
        .map(user -> new UserResponse()
            .setUsername(user.getUsername())
            .setAlias(user.getAlias()))
        .toList();
  }

  @GetMapping("{username}")
  public UserResponse getUser(@PathVariable String username) {
    final User user = userService.findByUsername(username);
    return new UserResponse()
        .setUsername(user.getUsername())
        .setAlias(user.getAlias())
        .setRoles(user.getRoles());
  }

  @PostMapping("")
  public String addUser(@RequestBody UserResponse user) {
    return userService.createUser(new User()
        .setUsername(user.getUsername())
        .setAlias(user.getAlias())
        .setRoles(user.getRoles()));
  }

  @PutMapping("{username}")
  public void updateUser(@PathVariable String username, @RequestBody UserResponse user) {
    userService.updateUser(new User()
        .setUsername(user.getUsername())
        .setAlias(user.getAlias())
        .setRoles(user.getRoles()));
  }

  @PutMapping("{username}/password")
  public void updatePassword(@PathVariable String username, @RequestBody JsonNode password) {
    userService.updatePassword(username, password.get("oldPassword").asText(), password.get("newPassword").asText());
  }

  @DeleteMapping("{username}")
  public void deleteUser(@PathVariable String username) {
    userService.deleteUser(username);
  }
}
