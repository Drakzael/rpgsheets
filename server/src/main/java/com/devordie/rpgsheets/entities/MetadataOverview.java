package com.devordie.rpgsheets.entities;

public record MetadataOverview(String name, String code, boolean deprecated) {
  public MetadataOverview(String name, String code) {
    this(name, code, false);
  }
}
