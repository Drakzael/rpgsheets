package com.devordie.rpgsheets.repository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.stereotype.Repository;

import com.devordie.rpgsheets.entities.Sheet;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

@Repository
public class SheetRepository {
  private static final ObjectMapper MAPPER = new ObjectMapper()
      .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
  private final LocalRepository localRepository;
  private List<Sheet> _sheets = null;

  public SheetRepository(LocalRepository localRepository) {
    this.localRepository = localRepository;
  }

  private List<Sheet> getSheets() {
    if (_sheets == null) {
      try (Stream<Path> files = Files.list(getSheetsPath())) {
        _sheets = new ArrayList<>();
        for (final Path file : files.filter(file -> file.toString().endsWith(".json")).toList()) {
          final String filename = file.getFileName().toString();
          final String id = filename.substring(0, filename.length() - ".json".length());
          _sheets.add(MAPPER.readValue(Files.readAllBytes(file), Sheet.class).setId(id));
        }
      } catch (IOException ex) {
        throw new IllegalStateException("Can't list sheet files", ex);
      }
    }
    return this._sheets;
  }

  public synchronized List<Sheet> listAllSheets() {
    return Collections.unmodifiableList(getSheets());
  }

  public synchronized Sheet getSheet(String sheetId) {
    return getSheets().stream()
        .filter(sheet -> sheet.getId().equals(sheetId))
        .findFirst().orElse(null);
  }

  public synchronized String createSheet(Sheet sheet) {
    final String sheetId = getNewSheetId();
    saveSheet(sheet.setId(sheetId));
    getSheets().add(sheet);
    return sheetId;
  }

  public synchronized void saveSheet(Sheet sheet) {
    try {
      MAPPER.writeValue(Files.newOutputStream(getSheetPath(sheet.getId())), sheet);
      getSheets().removeIf(sh -> sh.getId().equals(sheet.getId()));
      getSheets().add(sheet);
    } catch (IOException ex) {
      throw new IllegalStateException(ex);
    }
  }

  public synchronized void deleteSheet(String sheetId) {
    try {
      Files.delete(getSheetPath(sheetId));
      this.getSheets().removeIf(sheet -> sheet.getId().equals(sheetId));
    } catch (IOException ex) {
      //
    }
  }

  private Path getSheetsPath() {
    return localRepository.getBasePath().resolve("sheets");
  }

  private Path getSheetPath(String sheetId) {
    return localRepository.getBasePath().resolve("sheets").resolve(sheetId + ".json");
  }

  private String getNewSheetId() {
    try {
      if (!Files.exists(getSheetsPath())) {
        Files.createDirectories(getSheetsPath());
      }

    } catch (IOException ex) {
      throw new IllegalStateException(ex);
    }
    Integer i = 1;
    while (Files.exists(getSheetPath(i.toString()))) {
      ++i;
    }
    try {
      Files.createFile(getSheetPath(i.toString()));
      return i.toString();
    } catch (IOException ex) {
      throw new IllegalStateException();
    }
  }
}
