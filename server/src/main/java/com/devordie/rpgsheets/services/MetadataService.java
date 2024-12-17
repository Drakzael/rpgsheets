package com.devordie.rpgsheets.services;

import java.util.List;

import com.devordie.rpgsheets.entities.MetadataOverview;
import com.devordie.rpgsheets.repository.MetadataRepository;
import com.fasterxml.jackson.databind.JsonNode;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class MetadataService {

  @Inject
  private MetadataRepository repository;

  public List<MetadataOverview> listMetadata() {
    return repository.listAllMetadata();
  }

  public MetadataOverview getMetadataOverview(String id) {
    return repository.listAllMetadata().stream()
        .filter(metadata -> metadata.code().equals(id))
        .findFirst()
        .orElse(null);
  }

  public JsonNode getMetadata(String id) {
    return repository.getMetadata(id);
  }
}
