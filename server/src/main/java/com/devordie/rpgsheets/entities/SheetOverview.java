package com.devordie.rpgsheets.entities;

public class SheetOverview {
  private String name;
  private String userAlias;
  private String username;
  private String id;

  public String getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getUserAlias() {
    return userAlias;
  }

  public SheetOverview setId(String id) {
    this.id = id;
    return this;
  }

  public SheetOverview setName(String name) {
    this.name = name;
    return this;
  }

  public SheetOverview setUserAlias(String userAlias) {
    this.userAlias = userAlias;
    return this;
  }

  public String getUsername() {
    return username;
  }

  public SheetOverview setUsername(String username) {
    this.username = username;
    return this;
  }
}
