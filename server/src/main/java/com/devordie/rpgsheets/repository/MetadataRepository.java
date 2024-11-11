package com.devordie.rpgsheets.repository;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;

import com.devordie.rpgsheets.entities.MetadataOverview;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Repository
public class MetadataRepository extends LocalRepository {
  private static final Log LOGGER = LogFactory.getLog(MetadataRepository.class);
  private static final ObjectMapper MAPPER = new ObjectMapper()
      .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
  private static final String RESOURCE_METADATA_DIRECTORY = "/metadata";
  private static final String LOCAL_METADATA_DIRECTORY = "metadata";
  private static final String LOCAL_SOURCE_DIRECTORY = "metadata.source";

  private List<JsonNode> metadata = null;

  private void copyResources() {
    try {
      LOGGER.info("Copy metadata resources to " + this.getBasePath().resolve(LOCAL_SOURCE_DIRECTORY));
      Files.createDirectories(getBasePath().resolve(LOCAL_SOURCE_DIRECTORY));
      Files.createDirectories(getBasePath().resolve(LOCAL_METADATA_DIRECTORY));
      try (Stream<Path> files = Files
          .list(Path.of(MetadataRepository.class.getResource(RESOURCE_METADATA_DIRECTORY).toURI()))) {
        files.forEach(file -> {
          try {
            final String filename = file.getFileName().toString();
            final Path outputPath = getBasePath().resolve("metadata.source").resolve(filename).toAbsolutePath();
            LOGGER.info("Copy resource metadata file " + filename + " to " + outputPath.toString());
            Files.copy(Files.newInputStream(file), outputPath, StandardCopyOption.REPLACE_EXISTING);
          } catch (IOException ex) {
            LOGGER.warn("Error copying resource metadata file " + file.getFileName().toString());
          }
        });
      }
    } catch (IOException | URISyntaxException ex) {
      throw new IllegalStateException(ex);
    }
  }

  private List<JsonNode> getMetadata() {
    if (metadata == null) {
      copyResources();
      metadata = new ArrayList<>();
      try (Stream<Path> files = Files.list(this.getBasePath().resolve(LOCAL_METADATA_DIRECTORY))) {
        for (final Path file : files.filter(file -> file.toString().endsWith(".json")).toList()) {
          JsonNode node = MAPPER.readTree(Files.readAllBytes(file));
          LOGGER.info("Adding " + node.get("name").asText() + " metadata from "
              + this.getBasePath().resolve("metadata").toAbsolutePath().toString());
          metadata.add(node);
        }
      } catch (IOException ex) {
        throw new IllegalStateException("Can't list sheet files", ex);
      }
      try (Stream<Path> files = Files.list(this.getBasePath().resolve(LOCAL_SOURCE_DIRECTORY))) {
        for (final Path file : files.filter(file -> file.toString().endsWith(".json")).toList()) {
          JsonNode node = MAPPER.readTree(Files.readAllBytes(file));
          if (metadata.stream().filter(meta -> node.get("code").asText().equals(meta.get("code").asText()))
              .count() == 0) {
            LOGGER.info("Adding " + node.get("name").asText() + " metadata from "
                + this.getBasePath().resolve("metadata.source").toAbsolutePath().toString());
            metadata.add(node);
          } else {
            LOGGER.debug("Skipping " + node.get("name").asText() + " metadata from "
                + this.getBasePath().resolve("metadata.source").toAbsolutePath().toString() + " : already added");
          }
        }
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
    metadata = null; // FIXME restore cache
    return getMetadata().stream()
        .filter(json -> json.get("code").asText().equals(id))
        .findFirst().orElse(null);
  }
}
