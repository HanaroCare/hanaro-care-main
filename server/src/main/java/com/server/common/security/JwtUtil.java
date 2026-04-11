package com.server.common.security;

import com.server.common.exception.CustomJwtException;
import com.server.common.security.dto.SubscriberDTO;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

  @Value("${jwt.secret}")
  private String secret;

  @Value("${jwt.access-expiration}")
  private long accessExpiration;

  @Value("${jwt.refresh-expiration}")
  private long refreshExpiration;

  private SecretKey key;

  @PostConstruct
  public void init() {
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
  }

  public String createAccessToken(SubscriberDTO subscriber) {
    return createToken(subscriber, accessExpiration);
  }

  public String createRefreshToken(SubscriberDTO subscriber) {
    return createToken(subscriber, refreshExpiration);
  }

  private String createToken(SubscriberDTO subscriber, long expiration) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + expiration);

    return Jwts.builder()
        .subject(subscriber.getUserNm())
        .claims(subscriber.getClaims())
        .issuedAt(now)
        .expiration(expiryDate)
        .signWith(key)
        .compact();
  }

  public SubscriberDTO getSubscriber(String token) {
    Claims claims = parseClaims(token);
    Long userId = claims.get("userId", Long.class);
    String userNm = claims.getSubject();
    
    return new SubscriberDTO(userId, userNm, "", Collections.emptyList());
  }

  public void validateToken(String token) {
    try {
      parseClaims(token);
    } catch (ExpiredJwtException e) {
      throw new CustomJwtException("EXPIRED", "Token has expired");
    } catch (SignatureException | MalformedJwtException | UnsupportedJwtException | IllegalArgumentException e) {
      throw new CustomJwtException("INVALID", "Token is invalid");
    }
  }

  private Claims parseClaims(String token) {
    return Jwts.parser()
        .verifyWith(key)
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }
}
