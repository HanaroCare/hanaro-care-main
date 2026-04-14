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
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
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

  private static final long INVITE_EXPIRATION = 24 * 60 * 60 * 1000L; // 24시간

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
    java.util.List<String> roles = claims.get("roles", java.util.List.class);
    Boolean hanaCertYn = claims.get("hanaCertYn", Boolean.class);

    java.util.List<org.springframework.security.core.authority.SimpleGrantedAuthority> authorities =
        (roles != null) ? roles.stream()
            .map(org.springframework.security.core.authority.SimpleGrantedAuthority::new)
            .toList() : java.util.Collections.emptyList();

    return new SubscriberDTO(userId, userNm, "", Boolean.TRUE.equals(hanaCertYn), authorities);
  }

  public Map<String, Object> authenticationToClaims(Authentication authentication) {

    if (authentication.getPrincipal() instanceof SubscriberDTO subscriber) {
      Map<String, Object> claims = new HashMap<>();

      claims.put("userId", subscriber.getUserId());
      claims.put("userNm", subscriber.getUserNm());
      claims.put("hanaCertYn", subscriber.isHanaCertYn());
      claims.put("roles", subscriber.getAuthorities().stream()
          .map(GrantedAuthority::getAuthority).toList());

      claims.put("accessToken", createAccessToken(subscriber));
      claims.put("refreshToken", createRefreshToken(subscriber));
      claims.put("grantType", "Bearer");

      return claims;
    }

    throw new CustomJwtException("INVALID_AUTH", "인증 정보가 올바르지 않습니다.");
  }

  public void validateToken(String token) {
    try {
      parseClaims(token);
    } catch (ExpiredJwtException e) {
      throw new CustomJwtException("EXPIRED", "Token has expired");
    } catch (SignatureException | MalformedJwtException | UnsupportedJwtException |
             IllegalArgumentException e) {
      throw new CustomJwtException("INVALID", "Token is invalid");
    }
  }

  /**
   * 가족 초대용 토큰 생성 (grantorId와 relation 포함)
   */
  public String createInviteToken(Long grantorId, String relation) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + INVITE_EXPIRATION);

    return Jwts.builder()
        .claim("grantorId", grantorId)
        .claim("relation", relation)
        .issuedAt(now)
        .expiration(expiryDate)
        .signWith(key)
        .compact();
  }

  /**
   * 초대 토큰에서 모든 정보 추출
   */
  public Map<String, Object> getInfoFromInviteToken(String token) {
    try {
      Claims claims = parseClaims(token);
      Map<String, Object> info = new HashMap<>();
      info.put("grantorId", claims.get("grantorId", Long.class));
      info.put("relation", claims.get("relation", String.class));
      return info;
    } catch (Exception e) {
      throw new CustomJwtException("INVALID_INVITE_TOKEN", "유효하지 않은 초대 토큰입니다.");
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
