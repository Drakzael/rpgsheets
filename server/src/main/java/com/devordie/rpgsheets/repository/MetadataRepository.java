package com.devordie.rpgsheets.repository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.stereotype.Repository;

import com.devordie.rpgsheets.entities.MetadataOverview;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Repository
public class MetadataRepository extends LocalRepository {
  private static final ObjectMapper MAPPER = new ObjectMapper()
      .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

  private List<JsonNode> metadata = null;

  private List<JsonNode> getMetadata() {
    if (metadata == null) {
      try (Stream<Path> files = Files.list(this.getBasePath().resolve("metadata"))) {
        metadata = new ArrayList<>();
        for (final Path file : files.filter(file -> file.toString().endsWith(".json")).toList()) {
          metadata.add(MAPPER.readTree(Files.readAllBytes(file)));
        }
        return metadata;
      } catch (IOException ex) {
        throw new IllegalStateException("Can't list sheet files", ex);
      }
    }
    return metadata;
  }

  public List<MetadataOverview> listAllMetadata() {
    return getMetadata().stream()
        .map(json -> MAPPER.convertValue(json, MetadataOverview.class))
        .toList();
  }

  public JsonNode getMetadata(String id) {
    return getMetadata().stream()
        .filter(json -> json.get("code").asText().equals(id))
        .findFirst().orElse(null);
  }
}
