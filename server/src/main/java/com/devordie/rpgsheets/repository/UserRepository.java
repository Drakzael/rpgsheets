package com.devordie.rpgsheets.repository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.devordie.rpgsheets.entities.User;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

@Repository
public final class UserRepository extends LocalRepository {
  private static final String USERS_FILE = "users.json";
  private static final ObjectMapper MAPPER = new ObjectMapper()
      .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
  private final List<User> users;

  public UserRepository() {
    final Path path = getBasePath().resolve(USERS_FILE);
    if (!Files.exists(getBasePath().resolve(USERS_FILE))) {
      this.users = new ArrayList<>();
    } else {
      try {
        this.users = new ArrayList<>(List.of(MAPPER.readValue(Files.newInputStream(path), User[].class)));
      } catch (IOException ex) {
        throw new IllegalStateException("Unable to read users file.", ex);
      }
    }
  }

  public Optional<User> findByUsername(String username) {
    return users.stream().filter(user -> user.getUsername().equals(username)).findFirst();
  }

  public List<User> findAll() {
    return users;
  }

  public String createUser(User user) {
    if (users.stream().anyMatch(usr -> usr.getUsername().equals(user.getUsername()))) {
      throw new IllegalStateException("Duplicate user.");
    }

    users.add(user);
    try {
      MAPPER.writeValue(Files.newOutputStream(getBasePath().resolve(USERS_FILE)), users);
    } catch (IOException ex) {
      users.remove(user);
      throw new IllegalStateException("Unable to write users file", ex);
    }
    return user.getUsername();
  }

  public void updateUser(User user) {
    final User originalUser = this.users.stream()
        .filter(usr -> usr.getUsername().equals(user.getUsername()))
        .findFirst().orElseGet(null);
    if (originalUser != null) {
      users.remove(originalUser);
      users.add(user);
      try {
        MAPPER.writeValue(Files.newOutputStream(getBasePath().resolve(USERS_FILE)), users);
      } catch (IOException ex) {
        users.remove(user);
        users.add(originalUser);
        throw new IllegalStateException("Unable to write users file", ex);
      }
    }
  }

  public void deleteUser(String username) {
    final User user = this.users.stream()
        .filter(usr -> usr.getUsername().equals(username))
        .findFirst().orElseGet(null);
    if (user != null) {
      users.remove(user);
      try {
        MAPPER.writeValue(Files.newOutputStream(getBasePath().resolve(USERS_FILE)), users);
      } catch (IOException ex) {
        users.add(user);
        throw new IllegalStateException("Unable to write users file", ex);
      }
    }
  }
}
