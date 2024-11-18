package com.devordie.rpgsheets.entities;

import java.util.Map;

public class SheetResponse {
  private String id;
  private boolean writable;
  private boolean deletable;
  private String username;
  private String name;
  private String userAlias;
  private String game;
  private Map<String, Integer> numericValues;
  private Map<String, String> stringValues;

  public SheetResponse() {
  }

  public SheetResponse(Sheet sheet) {
    this();
    this.id = sheet.getId();
    this.name = sheet.getName();
    this.username = sheet.getUsername();
    this.userAlias = sheet.getUserAlias();
    this.game = sheet.getGame();
    this.numericValues = sheet.getNumericValues();
    this.stringValues = sheet.getStringValues();
    this.writable = sheet.isWritable();
    this.deletable = sheet.isDeletable();
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public boolean isWritable() {
    return writable;
  }

  public void setWritable(boolean writable) {
    this.writable = writable;
  }

  public boolean isDeletable() {
    return deletable;
  }

  public void setDeletable(boolean deletable) {
    this.deletable = deletable;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getUserAlias() {
    return userAlias;
  }

  public void setUserAlias(String userAlias) {
    this.userAlias = userAlias;
  }

  public String getGame() {
    return game;
  }

  public void setGame(String game) {
    this.game = game;
  }

  public Map<String, Integer> getNumericValues() {
    return numericValues;
  }

  public void setNumericValues(Map<String, Integer> numericValues) {
    this.numericValues = numericValues;
  }

  public Map<String, String> getStringValues() {
    return stringValues;
  }

  public void setStringValues(Map<String, String> stringValues) {
    this.stringValues = stringValues;
  }

  
}
