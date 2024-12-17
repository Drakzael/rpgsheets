package com.devordie.rpgsheets.services;

import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.devordie.rpgsheets.entities.Role;
import com.devordie.rpgsheets.entities.User;
import com.devordie.rpgsheets.repository.UserRepository;

import io.quarkus.elytron.security.common.BcryptUtil;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.SecurityContext;

@ApplicationScoped
public final class UserService {
  private static final Log LOGGER = LogFactory.getLog(UserService.class);

  @Inject
  private SecurityContext context;

  @Inject
  private UserRepository userRepository;

  public List<User> allUsers() {
    return userRepository.findAll();
  }

  public User findByUsername(String username) {
    return userRepository.findAll().stream().filter(user -> user.getUsername().equals(username)).findFirst()
        .orElseGet(null);
  }

  public User getCurrentUser() {
    return findByUsername(context.getUserPrincipal().getName());
  }

  public String encodePassword(String password) {
    return BcryptUtil.bcryptHash(password);
  }

  public boolean checkPassword(String password, String encodedPassword) {
    return BcryptUtil.matches(password, encodedPassword);
  }

  @PostConstruct
  public void checkUsers() {
    if (userRepository.findAll().stream().anyMatch(user -> user.hasRole(Role.Admin))) {
      return;
    }
    LOGGER.warn("No admin user found. Creating one.");
    String username = "admin";
    int suffix = 0;
    final Set<String> usernames = userRepository.findAll().stream().map(user -> user.getUsername())
        .collect(Collectors.toSet());

    while (usernames.contains(username)) {
      username = "admin" + suffix;
      ++suffix;
    }
    final int leftLimit = Math.max('0', Math.max('a', 'A'));
    final int rightLimit = Math.max('9', Math.max('z', 'Z'));
    final int targetStringLength = 10;
    final Random random = new Random();

    final String password = random.ints(leftLimit, rightLimit + 1)
        .filter(i -> (i >= '0' && i <= '9') || (i >= 'A' && i <= 'Z') || (i >= 'a' && i <= 'z'))
        .limit(targetStringLength)
        .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
        .toString();

    userRepository.createUser(new User()
        .setUsername(username)
        .setPassword(encodePassword(password))
        .setRoles(Set.of(Role.Admin)));

    LOGGER.warn("Creating user '" + username + "' with password '" + password + "'");
    LOGGER.warn("It is suggested you either change this password or create another admin account and remove this one.");
  }

  public String createUser(User user) {
    if (getCurrentUser().hasRole(Role.Admin)) {
      return userRepository.createUser(user);
    } else {
      return null;
    }
  }

  public void updateUser(User user) {
    if (getCurrentUser().getUsername().equals(user.getUsername()) ||
        getCurrentUser().hasRole(Role.Admin)) {
      final User originalUser = findByUsername(user.getUsername());
      user.setPassword(originalUser.getPassword());
      if (getCurrentUser().getUsername().equals(user.getUsername())) {
        user.setRoles(originalUser.getRoles());
      }
      userRepository.updateUser(user);
    }
  }

  public void updatePassword(String username, String oldPassword, String newPassword) {
    final User user = findByUsername(username);
    if (getCurrentUser().getUsername().equals(user.getUsername()) ||
        getCurrentUser().hasRole(Role.Admin)) {
      if (!getCurrentUser().getUsername().equals(user.getUsername()) ||
          checkPassword(oldPassword, user.getPassword())) {
        user.setPassword(encodePassword(newPassword));
        userRepository.updateUser(user);
      }
    }
  }

  public void deleteUser(String username) {
    if (getCurrentUser().hasRole(Role.Admin)) {
      userRepository.deleteUser(username);
    }
  }
}
