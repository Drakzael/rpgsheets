package com.devordie.rpgsheets.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.devordie.rpgsheets.entities.MetadataOverview;
import com.devordie.rpgsheets.repository.MetadataRepository;
import com.fasterxml.jackson.databind.JsonNode;

@Service
public class MetadataService {
  private final MetadataRepository repository;

  public MetadataService(MetadataRepository repository) {
    this.repository = repository;
  }

  public List<MetadataOverview> listMetadata() {
    return repository.listAllMetadata();
  }

  public JsonNode getMetadata(String id) {
    return repository.getMetadata(id);
  }
}
