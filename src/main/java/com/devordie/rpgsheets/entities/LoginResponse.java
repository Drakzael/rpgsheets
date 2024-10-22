package com.devordie.rpgsheets.entities;

public record LoginResponse(String token, long expiresIn) {
}
