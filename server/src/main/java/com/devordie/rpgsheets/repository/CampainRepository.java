package com.devordie.rpgsheets.repository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;

import com.devordie.rpgsheets.entities.Campain;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public final class CampainRepository {
  private static final ObjectMapper MAPPER = new ObjectMapper()
      .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
  private List<Campain> _campains = null;

  @Inject
  private LocalRepository localRepository;

  private List<Campain> getCampains() {
    if (_campains == null) {
      try {
        if (!Files.isDirectory(getRepositoryPath())) {
          Files.createDirectories(getRepositoryPath());
        }
      } catch (IOException ex) {
        throw new IllegalStateException("Couldn't create campain directory", ex);
      }
      try (final Stream<Path> files = Files.list(getRepositoryPath())) {
        _campains = new ArrayList<>();
        for (final Path file : files.filter(file -> file.toString().endsWith(".json")).toList()) {
          final String filename = file.getFileName().toString();
          final String id = filename.substring(0, filename.length() - ".json".length());
          _campains.add(MAPPER.readValue(Files.readAllBytes(file), Campain.class).setId(id));
        }
      } catch (IOException ex) {
        throw new IllegalStateException("Couldn't list campains", ex);
      }
    }
    return _campains;
  }

  public synchronized List<Campain> listAllCampains() {
    return Collections.unmodifiableList(getCampains());
  }

  public synchronized void saveCampain(Campain campain) {
    try {
      MAPPER.writeValue(Files.newOutputStream(getRepositoryPath().resolve(campain.getId() + ".json")), campain);
      getCampains().removeIf(c -> c.getId().equals(campain.getId()));
      getCampains().add(campain);
    } catch (IOException ex) {
      throw new IllegalStateException(ex);
    }
  }

  public synchronized String createCampain(Campain campain) {
    final String id = localRepository.getNewId(getRepositoryPath());
    saveCampain(campain.setId(id));
    return id;
  }

  public synchronized void deleteCampain(String id) {
    try {
      Files.delete(getRepositoryPath().resolve(id + ".json"));
      getCampains().removeIf(campain -> campain.getId().equals(id));
    } catch (IOException ex) {
      throw new IllegalStateException(ex);
    }
  }

  private Path getRepositoryPath() {
    return localRepository.getBasePath().resolve("campains");
  }
}
