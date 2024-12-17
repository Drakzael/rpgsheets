package com.devordie.rpgsheets.entities;

import java.util.Set;

public class User {
  private String alias;
  private String username;
  private String password;
  private Set<Role> roles;

  public String getUsername() {
    return username;
  }

  public User setUsername(String username) {
    this.username = username;
    return this;
  }

  public String getPassword() {
    return password;
  }

  public User setPassword(String password) {
    this.password = password;
    return this;
  }

  public String getAlias() {
    return alias;
  }

  public User setAlias(String alias) {
    this.alias = alias;
    return this;
  }

  public Set<Role> getRoles() {
    if (roles == null) {
      roles = Set.of();
    }
    return roles;
  }

  public User setRoles(Set<Role> roles) {
    this.roles = roles;
    return this;
  }

  public boolean hasRole(Role role) {
    return this.getRoles().contains(role);
  }
}
