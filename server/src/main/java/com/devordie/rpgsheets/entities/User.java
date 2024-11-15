package com.devordie.rpgsheets.entities;

import java.util.Collection;
import java.util.List;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({
    "authorities",
    "enabled",
    "login",
    "accountNonLocked",
    "accountNonExpired",
    "credentialsNonExpired"
})
public class User implements UserDetails {
  private String alias;
  private String username;
  private String password;
  private Set<Role> roles;

  @Override
  public String getUsername() {
    return username;
  }

  public User setUsername(String username) {
    this.username = username;
    return this;
  }

  @Override
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

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of();
  }
}
