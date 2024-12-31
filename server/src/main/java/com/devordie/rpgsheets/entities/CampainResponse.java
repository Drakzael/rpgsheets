package com.devordie.rpgsheets.entities;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class CampainResponse {
  private String id;
  private String name;
  private String gmName;
  private String description;
  private String gmDescription;
  private List<SheetOverviewResponse> sheets = new ArrayList<>();
  private boolean writable;
  private boolean deletable;
  private boolean mine;

  public String getId() {
    return id;
  }

  public String getDescription() {
    return description;
  }

  public String getName() {
    return name;
  }

  public List<SheetOverviewResponse> getSheets() {
    if (this.sheets == null) {
      this.sheets = new ArrayList<>();
    }
    return sheets;
  }

  public CampainResponse setId(String id) {
    this.id = id;
    return this;
  }

  public CampainResponse setName(String name) {
    this.name = name;
    return this;
  }

  public CampainResponse setDescription(String description) {
    this.description = description;
    return this;
  }

  public CampainResponse setSheets(List<SheetOverviewResponse> sheets) {
    this.getSheets().clear();
    this.getSheets().addAll(sheets);
    return this;
  }

  public String getGmDescription() {
    return gmDescription;
  }

  public CampainResponse setGmDescription(String gmDescription) {
    this.gmDescription = gmDescription;
    return this;
  }

  public boolean isWritable() {
    return writable;
  }

  public CampainResponse setWritable(boolean writable) {
    this.writable = writable;
    return this;
  }

  public boolean isDeletable() {
    return deletable;
  }

  public CampainResponse setDeletable(boolean deletable) {
    this.deletable = deletable;
    return this;
  }

  public boolean isMine() {
    return mine;
  }

  public CampainResponse setMine(boolean mine) {
    this.mine = mine;
    return this;
  }

  public String getGmName() {
    return this.gmName;
  }

  public CampainResponse setGmName(String gmName) {
    this.gmName = gmName;
    return this;
  }
}
