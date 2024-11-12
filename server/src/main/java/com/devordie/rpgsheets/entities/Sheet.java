package com.devordie.rpgsheets.entities;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class Sheet implements ISheet {
  @JsonIgnore
  private String id;
  private String username;

  private String name;
  private String userAlias;
  private String game;
  private Map<String, Integer> numericValues;
  private Map<String, String> stringValues;

  public String getId() {
    return id;
  }

  public Sheet setId(String id) {
    this.id = id;
    return this;
  }

  public String getName() {
    return name;
  }

  public Sheet setName(String name) {
    this.name = name;
    return this;
  }

  public String getUsername() {
    return username;
  }

  public Sheet setUsername(String username) {
    this.username = username;
    return this;
  }

  public String getUserAlias() {
    return userAlias;
  }

  public Sheet setUserAlias(String userAlias) {
    this.userAlias = userAlias;
    return this;
  }

  public String getGame() {
    return game;
  }

  public Sheet setGame(String game) {
    this.game = game;
    return this;
  }

  public Map<String, Integer> getNumericValues() {
    return numericValues;
  }

  public Sheet setNumericValues(Map<String, Integer> numericValues) {
    this.numericValues = numericValues;
    return this;
  }

  public Map<String, String> getStringValues() {
    return stringValues;
  }

  public Sheet setStringValues(Map<String, String> stringValues) {
    this.stringValues = stringValues;
    return this;
  }

}
