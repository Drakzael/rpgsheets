package com.devordie.rpgsheets.entities;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class Campain {
  private String name;
  private String id;
  private String username;
  private String description;
  private String gmDescription;
  private List<String> sheetIds = new ArrayList<>();
  @JsonIgnore
  private boolean writable;
  @JsonIgnore
  private boolean deletable;

  public Campain() {
  }

  private Campain(Campain source) {
    this.name = source.name;
    this.id = source.id;
    this.username = source.username;
    this.description = source.description;
    this.gmDescription = source.gmDescription;
    this.sheetIds.addAll(source.sheetIds);
    this.writable = source.writable;
    this.deletable = source.deletable;
  }

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

  public Campain withSheetIds(List<String> sheetIds) {
    final Campain campain = new Campain(this);
    campain.sheetIds.clear();
    campain.sheetIds.addAll(sheetIds);
    return campain;
  }

  public List<String> getSheetIds() {
    if (sheetIds == null) {
      sheetIds = new ArrayList<>();
    }
    return Collections.unmodifiableList(sheetIds);
  }

  public Campain withAddedSheetId(String sheetId) {
    final Campain campain = new Campain(this);
    if (!campain.sheetIds.contains(sheetId)) {
      campain.sheetIds.add(sheetId);
    }
    return campain;
  }

  public Campain withRemovedSheetId(String sheetId) {
    final Campain campain = new Campain(this);
    campain.sheetIds.remove(sheetId);
    return campain;
  }

  public Campain withUsername(String username) {
    final Campain campain = new Campain(this);
    campain.username = username;
    return campain;
  }

  public String getGmDescription() {
    return gmDescription;
  }

  public boolean isWritable() {
    return writable;
  }

  public Campain withWritable(boolean writable) {
    final Campain campain = new Campain(this);
    campain.writable = writable;
    return campain;
  }

  public boolean isDeletable() {
    return deletable;
  }

  public Campain withDeletable(boolean readable) {
    final Campain campain = new Campain(this);
    campain.deletable = readable;
    return campain;
  }
}
