package com.devordie.rpgsheets.entities;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Campain {
  private String name;
  private String id;
  private String username;
  private String description;
  private String gmDescription;
  private List<String> sheetIds = new ArrayList<>();
  private boolean writable;
  private boolean deletable;

  public Campain setId(String id) {
    this.id = id;
    return this;
  }

  public String getId() {
    return id;
  }

  public String getUsername() {
    return username;
  }

  public String getName() {
    return name;
  }

  public String getDescription() {
    return description;
  }

  public Campain setSheetIds(List<String> sheetIds) {
    if (this.sheetIds == null) {
      this.sheetIds = new ArrayList<>();
    } else {
      this.sheetIds.clear();
    }
    this.sheetIds.addAll(sheetIds);
    return this;
  }

  public List<String> getSheetIds() {
    if (sheetIds == null) {
      sheetIds = new ArrayList<>();
    }
    return sheetIds;
  }

  public Campain addSheetId(String sheetId) {
    if (!sheetIds.contains(sheetId)) {
      sheetIds.add(sheetId);
    }
    return this;
  }

  public Campain removeSheetId(String sheetId) {
    sheetIds.remove(sheetId);
    return this;
  }

  public Campain setUsername(String username) {
    this.username = username;
    return this;
  }

  public String getGmDescription() {
    return gmDescription;
  }

  public boolean isWritable() {
    return writable;
  }

  public Campain setWritable(boolean writable) {
    this.writable = writable;
    return this;
  }

  public boolean isDeletable() {
    return deletable;
  }

  public Campain setDeletable(boolean readable) {
    this.deletable = readable;
    return this;
  }
}
