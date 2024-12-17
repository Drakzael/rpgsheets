package com.devordie.rpgsheets.repository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import com.devordie.rpgsheets.entities.User;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public final class UserRepository {
  private static final String USERS_FILE = "users.json";
  private static final ObjectMapper MAPPER = new ObjectMapper()
      .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
  private List<User> users = null;

  @Inject
  private LocalRepository localRepository;

  private List<User> getUsers() {
    if (users == null) {
      final Path path = localRepository.getBasePath().resolve(USERS_FILE);
      if (!Files.exists(path)) {
        users = new ArrayList<>();
      } else {
        try {
          users = new ArrayList<>(List.of(MAPPER.readValue(Files.newInputStream(path), User[].class)));
        } catch (IOException ex) {
          throw new IllegalStateException("Unable to read users file.", ex);
        }
      }
    }
    return users;
  }

  public synchronized Optional<User> findByUsername(String username) {
    return getUsers().stream().filter(user -> user.getUsername().equals(username)).findFirst();
  }

  public synchronized List<User> findAll() {
    return Collections.unmodifiableList(getUsers());
  }

  public synchronized String createUser(User user) {
    final List<User> users = getUsers();
    if (users.stream().anyMatch(usr -> usr.getUsername().equals(user.getUsername()))) {
      throw new IllegalStateException("Duplicate user.");
    }

    users.add(user);
    try {
      MAPPER.writeValue(Files.newOutputStream(localRepository.getBasePath().resolve(USERS_FILE)), users);
    } catch (IOException ex) {
      users.remove(user);
      throw new IllegalStateException("Unable to write users file", ex);
    }
    return user.getUsername();
  }

  public synchronized void updateUser(User user) {
    final List<User> users = getUsers();
    final User originalUser = users.stream()
        .filter(usr -> usr.getUsername().equals(user.getUsername()))
        .findFirst().orElseGet(null);
    if (originalUser != null) {
      users.remove(originalUser);
      users.add(user);
      try {
        MAPPER.writeValue(Files.newOutputStream(localRepository.getBasePath().resolve(USERS_FILE)), users);
      } catch (IOException ex) {
        users.remove(user);
        users.add(originalUser);
        throw new IllegalStateException("Unable to write users file", ex);
      }
    }
  }

  public synchronized void deleteUser(String username) {
    final List<User> users = getUsers();
    final User user = users.stream()
        .filter(usr -> usr.getUsername().equals(username))
        .findFirst().orElseGet(null);
    if (user != null) {
      users.remove(user);
      try {
        MAPPER.writeValue(Files.newOutputStream(localRepository.getBasePath().resolve(USERS_FILE)), users);
      } catch (IOException ex) {
        users.add(user);
        throw new IllegalStateException("Unable to write users file", ex);
      }
    }
  }
}
