package com.server.auth.repository;

import com.server.auth.entity.TBRefreshToken;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TBRefreshTokenRepository extends JpaRepository<TBRefreshToken, Long> {
  Optional<TBRefreshToken> findByTokenValue(String tokenValue);
}
