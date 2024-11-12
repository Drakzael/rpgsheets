package com.devordie.rpgsheets.entities;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class User implements UserDetails {
  private String alias;
  private String username;
  private String password;

  @Override
  public String getUsername() {
    return username;
  }

  public String getLogin() {
    return getUsername();
  }

  @Override
  public String getPassword() {
    return password;
  }

  public String getAlias() {
    return alias;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of();
  }
}
