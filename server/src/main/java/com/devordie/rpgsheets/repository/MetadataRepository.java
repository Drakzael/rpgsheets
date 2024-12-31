package com.devordie.rpgsheets.repository;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.FileSystemNotFoundException;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Stream;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.devordie.rpgsheets.entities.Icon;
import com.devordie.rpgsheets.entities.MetadataOverview;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class MetadataRepository {
  private static final Log LOGGER = LogFactory.getLog(MetadataRepository.class);
  private static final ObjectMapper MAPPER = new ObjectMapper()
      .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
  private static final String RESOURCE_METADATA_DIRECTORY = "/metadata";
  private static final String LOCAL_METADATA_DIRECTORY = "metadata";
  private static final String LOCAL_SOURCE_DIRECTORY = "metadata.source";
  private List<JsonNode> metadata = new ArrayList<>();

  @Inject
  private LocalRepository localRepository;

  private void copyResources() {
    try {
      LOGGER.info("Copy metadata resources to " + getNativePath());
      Files.createDirectories(getNativePath());
      Files.createDirectories(getCustomPath());
      clearDirectory(getNativePath());

      Path dirPath = null;
      URI uri = null;
      try {
        uri = MetadataRepository.class.getResource(RESOURCE_METADATA_DIRECTORY).toURI();
        dirPath = Paths.get(uri);
      } catch (FileSystemNotFoundException e) {
        // If this is thrown, then it means that we are running the JAR directly
        // (example: not from an IDE)
        dirPath = FileSystems.newFileSystem(uri, new HashMap<String, String>()).getPath(RESOURCE_METADATA_DIRECTORY);
      }

      try (final Stream<Path> files = Files.list(dirPath)) {
        files.forEach(file -> {
          try {
            final String filename = file.getFileName().toString();
            final Path outputPath = getNativePath().resolve(filename).toAbsolutePath();
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

  private void clearDirectory(Path directory) {
    LOGGER.info("Clearing directory " + directory.toAbsolutePath().toString());
    try (Stream<Path> files = Files.list(directory)) {
      files.forEach(file -> {
        try {
          Files.delete(file);
        } catch (IOException ex) {
          LOGGER.warn("Error deleting file " + file.getFileName().toString() + " from "
              + directory.toAbsolutePath().toString());
        }
      });
    } catch (IOException ex) {
      LOGGER.warn("Error clearing directory " + directory.toAbsolutePath().toString());
    }
  }

  private List<JsonNode> getMetadata() {
    synchronized (metadata) {
      if (metadata.isEmpty()) {
        copyResources();
        metadata = new ArrayList<>();
        try (Stream<Path> files = Files.list(getCustomPath())) {
          for (final Path file : files.filter(file -> file.toString().endsWith(".json")).toList()) {
            JsonNode node = MAPPER.readTree(Files.readAllBytes(file));
            LOGGER.info("Adding custom " + node.get("name").asText() + " metadata from "
                + getCustomPath().toAbsolutePath().toString());
            metadata.add(node);
          }
        } catch (IOException ex) {
          throw new IllegalStateException("Can't list metadata files in " + LOCAL_METADATA_DIRECTORY, ex);
        }
        try (Stream<Path> files = Files.list(getNativePath())) {
          for (final Path file : files.filter(file -> file.toString().endsWith(".json")).toList()) {
            JsonNode node = MAPPER.readTree(Files.readAllBytes(file));
            if (metadata.stream().filter(meta -> node.get("code").asText().equals(meta.get("code").asText()))
                .count() == 0) {
              LOGGER.info("Adding native " + node.get("name").asText() + " metadata from "
                  + getNativePath().toAbsolutePath().toString());
              metadata.add(node);
            } else {
              LOGGER.debug("Skipping native " + node.get("name").asText() + " metadata from "
                  + getNativePath().toAbsolutePath().toString() + " : already added");
            }
          }
        } catch (IOException ex) {
          throw new IllegalStateException("Can't list metadata files in " + LOCAL_SOURCE_DIRECTORY, ex);
        }
      }
    }
    return metadata;
  }

  private Path getCustomPath() {
    return localRepository.getBasePath().resolve(LOCAL_METADATA_DIRECTORY);
  }

  private Path getNativePath() {
    return localRepository.getBasePath().resolve(LOCAL_SOURCE_DIRECTORY);
  }

  public List<MetadataOverview> listAllMetadata() {
    return getMetadata().stream()
        .map(json -> {
          final String name = json.get("name").asText();
          final String code = json.get("code").asText();
          final String iconCode = json.has("icon") ? json.get("icon").asText() : null;
          final Icon icon = iconCode == null ? null : MAPPER.convertValue(json.get("icons").get(iconCode), Icon.class);
          final boolean deprecated = json.has("deprecated") ? json.get("deprecated").asBoolean() : false;
          return new MetadataOverview(name, code, icon, deprecated);
        })
        .toList();
  }

  public JsonNode getMetadata(String id) {
    return getMetadata().stream()
        .filter(json -> json.get("code").asText().equals(id))
        .findFirst().orElse(null);
  }
}
