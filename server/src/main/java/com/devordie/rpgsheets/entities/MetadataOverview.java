package com.devordie.rpgsheets.entities;

public record MetadataOverview(String name, String code, Icon icon, boolean deprecated) {
  public MetadataOverview(String name, String code, Icon icon) {
    this(name, code, icon, false);
  }
}
