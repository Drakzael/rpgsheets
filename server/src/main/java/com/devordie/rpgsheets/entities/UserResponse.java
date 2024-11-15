package com.devordie.rpgsheets.entities;

import java.util.Set;

public class UserResponse {
  private String username;
  private String alias;
  private Set<Role> roles;

  public String getUsername() {
    return username;
  }

  public UserResponse setUsername(String username) {
    this.username = username;
    return this;
  }

  public String getAlias() {
    return alias;
  }

  public UserResponse setAlias(String alias) {
    this.alias = alias;
    return this;
  }

  public Set<Role> getRoles() {
    return roles;
  }

  public UserResponse setRoles(Set<Role> roles) {
    this.roles = roles;
    return this;
  }
}
