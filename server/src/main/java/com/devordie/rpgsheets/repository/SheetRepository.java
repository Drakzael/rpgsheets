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
    try (Stream<Path> files = Files.list(this.getBasePath().resolve("sheets"))) {
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

  public Sheet getSheet(String id) {
    try {
      return MAPPER.readValue(Files.readAllBytes(this.getBasePath().resolve("sheets").resolve(id + ".json")), Sheet.class).setId(id);
    } catch (IOException ex) {
      throw new IllegalStateException();
    }
  }
}
