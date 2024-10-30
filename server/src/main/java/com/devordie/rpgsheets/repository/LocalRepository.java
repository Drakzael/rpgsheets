package com.devordie.rpgsheets.repository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public abstract class LocalRepository {
	private static final Log LOGGER = LogFactory.getLog(LocalRepository.class);
  private static final Path LOCAL_REPOSITORY = Path.of("./data");
  private static final Path HOME_REPOSITORY = Path.of(".rpgsheets");
  private Path path = null;

  protected Path getBasePath() {
    if (path == null) {
      if (Files.isDirectory(LOCAL_REPOSITORY)) {
        LOGGER.info("Found local directory " + LOCAL_REPOSITORY.toAbsolutePath().toString());
        path = LOCAL_REPOSITORY;
      }
      final Path path = Path.of(System.getProperty("user.home")).resolve(HOME_REPOSITORY);
      if (!Files.isDirectory(path)) {

        if (Files.exists(path)) {
          throw new IllegalStateException("Can't create directory " + path.toString() + " : file already exist.");
        }
        try {
          Files.createDirectories(path);
        } catch (IOException ex) {
          throw new IllegalStateException("Can't create directory " + path.toString(), ex);
        }
      }
      LOGGER.info("Found home directory " + path.toAbsolutePath().toString());
      this.path = path;
    }
    return path;
  }
}
