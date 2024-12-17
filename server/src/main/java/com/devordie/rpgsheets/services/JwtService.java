package com.devordie.rpgsheets.services;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import com.devordie.rpgsheets.entities.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class JwtService {

  // @Value("${security.jwt.secret-key}")
  private String secretKey = "cnBnc2hlZXRzLXNlY3JldC1rZXkgYm9yZGVybCBpbCBmYXV0IHVuIHRydWMgbG9uZw==";

  // @Value("${security.jwt.expiration-time}")
  private long expirationTime = 36000000;

  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    return claimsResolver.apply(extractAllClaims(token));
  }

  public String generateToken(User user) {
    return generateToken(new HashMap<>(), user);
  }

  public String generateToken(Map<String, Object> extraClaims, User user) {
    return buildToken(extraClaims, user, expirationTime);
  }

  public long getExpirationTime() {
    return expirationTime;
  }

  public boolean isTokenValid(String token, User user) {
    final String username = extractUsername(token);
    return (username.equals(user.getUsername())) && !isTokenExpired(token);
  }

  private String buildToken(
      Map<String, Object> extraClaims,
      User user,
      long expiration) {
    return Jwts
        .builder()
        .setClaims(extraClaims)
        .setSubject(user.getUsername())
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + expiration))
        .signWith(getSignInKey(), SignatureAlgorithm.HS256)
        .compact();
  }

  private Claims extractAllClaims(String token) {
    return Jwts
        .parserBuilder()
        .setSigningKey(getSignInKey())
        .build()
        .parseClaimsJws(token)
        .getBody();
  }

  private Key getSignInKey() {
    final byte[] keyBytes = Decoders.BASE64.decode(secretKey);
    return Keys.hmacShaKeyFor(keyBytes);
  }

  private Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  private boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
  }
}
