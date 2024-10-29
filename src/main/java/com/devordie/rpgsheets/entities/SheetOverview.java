package com.devordie.rpgsheets.entities;

public class SheetOverview implements ISheet {
  private String name;
  private String username;
  private String id;

  public String getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getUsername() {
    return username;
  }

  public SheetOverview setId(String id) {
    this.id = id;
    return this;
  }

  public SheetOverview setName(String name) {
    this.name = name;
    return this;
  }

  public SheetOverview setUsername(String username) {
    this.username = username;
    return this;
  }
}
