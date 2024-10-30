package com.devordie.rpgsheets.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devordie.rpgsheets.entities.MetadataOverview;
import com.devordie.rpgsheets.services.MetadataService;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/metadata")
public class MetadataController {
  private final MetadataService service;

  public MetadataController(MetadataService service) {
this.service = service;
  }

  @GetMapping("{game}")
  public ResponseEntity<JsonNode> getMetadataGame(@PathVariable String game) {
    final JsonNode metadata = service.getMetadata(game);
    if (metadata == null) {
      return ResponseEntity.notFound().build();
    }
      return ResponseEntity.ok(metadata);
  }

  @GetMapping("")
  public ResponseEntity<List<MetadataOverview>> listMetadataGames() {
      return ResponseEntity.ok(service.listMetadata());
  }
}
