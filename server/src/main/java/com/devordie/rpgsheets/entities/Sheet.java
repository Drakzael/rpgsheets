package com.devordie.rpgsheets.entities;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class Sheet {
  @JsonIgnore
  private String id;

  @JsonIgnore
  private boolean writable;

  @JsonIgnore
  private boolean deletable;

  private String username;
  private String name;
  private String game;
  private String mode;
  private Map<String, Integer> numericValues;
  private Map<String, String> stringValues;

  public String getId() {
    return id;
  }

  public Sheet setId(String id) {
    this.id = id;
    return this;
  }

  public boolean isWritable() {
    return writable;
  }

  public Sheet setWritable(boolean writable) {
    this.writable = writable;
    return this;
  }

  public boolean isDeletable() {
    return deletable;
  }

  public Sheet setDeletable(boolean deletable) {
    this.deletable = deletable;
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

  public String getMode() {
    return mode;
  }

  public Sheet setMode(String mode) {
    this.mode = mode;
    return this;
  }
}
