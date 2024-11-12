package com.devordie.rpgsheets.repository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.stereotype.Repository;

import com.devordie.rpgsheets.entities.Campain;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

@Repository
public class CampainRepository extends LocalRepository {
  private static final ObjectMapper MAPPER = new ObjectMapper()
      .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

  public List<Campain> listAllCampains() {
    ensureDirectory();
    try (final Stream<Path> files = Files.list(getRepositoryPath())) {
      final List<Campain> campains = new ArrayList<>();
      for (final Path file : files.filter(file -> file.toString().endsWith(".json")).toList()) {
        final String filename = file.getFileName().toString();
        final String id = filename.substring(0, filename.length() - ".json".length());
        campains.add(MAPPER.readValue(Files.readAllBytes(file), Campain.class).setId(id));
      }
      return campains;
    } catch (IOException ex) {
      throw new IllegalStateException("Couldn't list campains", ex);
    }
  }

  public void saveCampain(Campain campain) {
    try {
      MAPPER.writeValue(Files.newOutputStream(getRepositoryPath().resolve(campain.getId() + ".json")), campain);
    } catch (IOException ex) {
      throw new IllegalStateException(ex);
    }
  }

  public String createCampain(Campain campain) {
    final String id = getNewId();
    saveCampain(campain.setId(id));
    return id;
  }

  public void deleteCampain(String id) {
    try {
      Files.delete(getRepositoryPath().resolve(id + ".json"));
    } catch (IOException ex) {
      throw new IllegalStateException(ex);
    }
  }

  @Override
  protected Path getRepositoryPath() {
    return getBasePath().resolve("campains");
  }

  private void ensureDirectory() {
    try {
      if (!Files.isDirectory(getRepositoryPath())) {
        Files.createDirectories(getRepositoryPath());
      }
    } catch (IOException ex) {
      throw new IllegalStateException("Couldn't create campain directory", ex);
    }
  }
}
