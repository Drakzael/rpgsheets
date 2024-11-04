package com.devordie.rpgsheets.repository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.stereotype.Repository;

import com.devordie.rpgsheets.entities.Sheet;
import com.devordie.rpgsheets.entities.SheetOverview;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

@Repository
public class SheetRepository extends LocalRepository {
  private static final ObjectMapper MAPPER = new ObjectMapper()
      .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

  public List<SheetOverview> listAllSheets() {
    try (Stream<Path> files = Files.list(getSheetsPath())) {
      List<SheetOverview> sheets = new ArrayList<>();
      for (final Path file : files.filter(file -> file.toString().endsWith(".json")).toList()) {
        final String filename = file.getFileName().toString();
        final String id = filename.substring(0, filename.length() - ".json".length());
        sheets.add(MAPPER.readValue(Files.readAllBytes(file), SheetOverview.class).setId(id));
      }
      return sheets;
    } catch (IOException ex) {
      throw new IllegalStateException("Can't list sheet files", ex);
    }
  }

  public Sheet getSheet(String sheetId) {
    try {
      return MAPPER
          .readValue(Files.readAllBytes(getSheetPath(sheetId)), Sheet.class)
          .setId(sheetId);
    } catch (IOException ex) {
      throw new IllegalStateException();
    }
  }

  public String createSheet(Sheet sheet) {
    final String sheetId = getNewSheetId();
    saveSheet(sheet.setId(sheetId));
    return sheetId;
  }

  public void saveSheet(Sheet sheet) {
    try {
      MAPPER.writeValue(Files.newOutputStream(getSheetPath(sheet.getId())), sheet);
    } catch (IOException ex) {
      throw new IllegalStateException(ex);
    }
  }

  public void deleteSheet(String sheetId) {
    try {
      Files.delete(getSheetPath(sheetId));
    } catch (IOException ex) {
      //
    }
  }

  private Path getSheetsPath() {
    return getBasePath().resolve("sheets");
  }

  private Path getSheetPath(String sheetId) {
    return getBasePath().resolve("sheets").resolve(sheetId + ".json");
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
