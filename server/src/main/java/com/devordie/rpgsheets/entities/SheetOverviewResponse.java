package com.devordie.rpgsheets.entities;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class SheetOverviewResponse {
  private String name;
  private String id;
  private String game;
  private Boolean mine = null;
  private Boolean deprecated = null;
  private Boolean dead = null;

  public String getName() {
    return name;
  }

  public SheetOverviewResponse setName(String name) {
    this.name = name;
    return this;
  }

  public String getId() {
    return id;
  }

  public SheetOverviewResponse setId(String id) {
    this.id = id;
    return this;
  }

  public Boolean getMine() {
    return mine;
  }

  public SheetOverviewResponse setMine(Boolean mine) {
    this.mine = mine;
    return this;
  }

  public Boolean getDeprecated() {
    return deprecated;
  }

  public SheetOverviewResponse setDeprecated(Boolean deprecated) {
    this.deprecated = deprecated;
    return this;
  }

  public String getGame() {
    return this.game;
  }

  public SheetOverviewResponse setGame(String game) {
    this.game = game;
    return this;
  }

  public Boolean getDead() {
    return dead;
  }

  public SheetOverviewResponse setDead(Boolean dead) {
    this.dead = dead;
    return this;
  }
}
