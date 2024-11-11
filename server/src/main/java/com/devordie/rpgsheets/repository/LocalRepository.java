package com.devordie.rpgsheets.repository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public abstract class LocalRepository {
  private static final Log LOGGER = LogFactory.getLog(LocalRepository.class);
  private static final Path LOCAL_REPOSITORY = Path.of("data");
  private static final Path HOME_REPOSITORY = Path.of(".rpgsheets");
  private Path path = null;

  protected Path getBasePath() {
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
}
