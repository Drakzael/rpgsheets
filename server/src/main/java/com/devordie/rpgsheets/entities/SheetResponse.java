package com.devordie.rpgsheets.entities;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class SheetResponse {
  private String id;
  private boolean writable;
  private boolean deletable;
  private String username;
  private String name;
  private String userAlias;
  private String game;
  private String mode;
  private Map<String, Integer> numericValues;
  private Map<String, String> stringValues;
  private List<IdName> campains;
  private Boolean dead;

  public SheetResponse() {
  }

  public SheetResponse(Sheet sheet) {
    this();
    this.id = sheet.getId();
    this.name = sheet.getName();
    this.username = sheet.getUsername();
    this.game = sheet.getGame();
    this.mode = sheet.getMode();
    this.numericValues = sheet.getNumericValues();
    this.stringValues = sheet.getStringValues();
    this.writable = sheet.isWritable();
    this.deletable = sheet.isDeletable();
    this.campains = new ArrayList<>();
    this.dead = sheet.isDead();
  }

  public String getId() {
    return id;
  }

  public SheetResponse setId(String id) {
    this.id = id;
    return this;
  }

  public boolean isWritable() {
    return writable;
  }

  public SheetResponse setWritable(boolean writable) {
    this.writable = writable;
    return this;
  }

  public boolean isDeletable() {
    return deletable;
  }

  public SheetResponse setDeletable(boolean deletable) {
    this.deletable = deletable;
    return this;
  }

  public String getUsername() {
    return username;
  }

  public SheetResponse setUsername(String username) {
    this.username = username;
    return this;
  }

  public String getName() {
    return name;
  }

  public SheetResponse setName(String name) {
    this.name = name;
    return this;
  }

  public String getUserAlias() {
    return userAlias;
  }

  public SheetResponse setUserAlias(String userAlias) {
    this.userAlias = userAlias;
    return this;
  }

  public String getGame() {
    return game;
  }

  public SheetResponse setGame(String game) {
    this.game = game;
    return this;
  }

  public String getMode() {
    return mode;
  }

  public SheetResponse setMode(String mode) {
    this.mode = mode;
    return this;
  }

  public Map<String, Integer> getNumericValues() {
    return numericValues;
  }

  public SheetResponse setNumericValues(Map<String, Integer> numericValues) {
    this.numericValues = numericValues;
    return this;
  }

  public Map<String, String> getStringValues() {
    return stringValues;
  }

  public SheetResponse setStringValues(Map<String, String> stringValues) {
    this.stringValues = stringValues;
    return this;
  }

  public List<IdName> getCampains() {
    return campains;
  }

  public SheetResponse setCampains(List<IdName> campains) {
    this.campains = campains;
    return this;
  }

  public Boolean isDead() {
    return dead;
  }

  public SheetResponse setDead(Boolean dead) {
    this.dead = dead;
    return this;
  }
}
