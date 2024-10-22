package com.devordie.rpgsheets.repository;

import java.util.List;
import java.util.Optional;

import com.devordie.rpgsheets.entities.User;

public interface UserRepository {
  Optional<User> findByUsername(String username);
  List<User> findAll();
}
