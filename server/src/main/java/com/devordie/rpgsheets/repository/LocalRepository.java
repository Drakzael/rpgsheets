package com.devordie.rpgsheets.repository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public final class LocalRepository {
  private static final Log LOGGER = LogFactory.getLog(LocalRepository.class);
  private static final Path LOCAL_REPOSITORY = Path.of("data");
  private static final Path HOME_REPOSITORY = Path.of(".rpgsheets");
  private Path path = null;

  public synchronized Path getBasePath() {
    if (path == null) {
      if (!tryLocalDirectory(LOCAL_REPOSITORY.toAbsolutePath())
          && !tryLocalDirectory(Path.of(System.getProperty("user.home")).resolve(HOME_REPOSITORY).toAbsolutePath())) {
        try {
          path = Path.of(System.getProperty("user.home")).resolve(HOME_REPOSITORY);
          LOGGER.info("Generating local directory " + path);
          Files.createDirectories(path);
        } catch (IOException ex) {
          this.path = null;
          throw new IllegalStateException("Can't create directory " + path.toString(), ex);
        }
      }
    }
    return path;
  }

  private boolean tryLocalDirectory(Path path) {
    LOGGER.info("Try local repository at " + path.toString());
    if (Files.isDirectory(path)) {
      LOGGER.info("Found local data directory at " + path.toString());
      this.path = path;
      return true;
    }
    return false;
  }

  String getNewId(Path parentPath) {
    try {
      if (!Files.exists(parentPath)) {
        Files.createDirectories(parentPath);
      }

    } catch (IOException ex) {
      throw new IllegalStateException(ex);
    }
    Integer i = 1;
    while (Files.exists(parentPath.resolve(i.toString() + ".json"))) {
      ++i;
    }
    try {
      Files.createFile(parentPath.resolve(i.toString() + ".json"));
      return i.toString();
    } catch (IOException ex) {
      throw new IllegalStateException();
    }
  }
}
