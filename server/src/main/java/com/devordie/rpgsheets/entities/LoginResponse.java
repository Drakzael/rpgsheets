package com.devordie.rpgsheets.entities;

public class LoginResponse {

  private String alias;
  private String token;
  private long expiresIn;

  public LoginResponse() {

  }

  public String getAlias() {
    return alias;
  }

  public String getToken() {
    return token;
  }

  public long getExpiresIn() {
    return expiresIn;
  }

  public LoginResponse setAlias(String alias) {
    this.alias = alias;
    return this;
  }

  public LoginResponse setToken(String token) {
    this.token = token;
    return this;
  }

  public LoginResponse setExpiresIn(long expiresIn) {
    this.expiresIn = expiresIn;
    return this;
  }
}