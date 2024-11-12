package com.devordie.rpgsheets.entities;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class CampainResponse {
  private String id;
  private String name;
  private String description;
  private List<SheetOverviewResponse> sheets = new ArrayList<>();

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
}
