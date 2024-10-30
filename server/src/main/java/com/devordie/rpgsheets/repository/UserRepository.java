package com.devordie.rpgsheets.repository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.devordie.rpgsheets.entities.User;
import com.fasterxml.jackson.databind.ObjectMapper;

@Repository
public final class UserRepository extends LocalRepository {
  private static final String USERS_FILE = "users.json";
  private static final ObjectMapper MAPPER = new ObjectMapper();
  private final List<User> users;

  public UserRepository() {
    final Path path = getBasePath().resolve(USERS_FILE);
    try {
      this.users = List.of(MAPPER.readValue(Files.newInputStream(path), User[].class));
    } catch (IOException ex) {
      throw new IllegalStateException("Unable to read users file.", ex);
    }
  }

  public Optional<User> findByUsername(String username) {
    return users.stream().filter(user -> user.getUsername().equals(username)).findFirst();
  }

  public List<User> findAll() {
    return users;
  }
}
