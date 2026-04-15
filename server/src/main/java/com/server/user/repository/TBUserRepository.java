package com.server.user.repository;

import com.server.user.entity.TBUser;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;

public interface TBUserRepository extends JpaRepository<TBUser, Long> {
  Optional<TBUser> findByUserNm(String userNm);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select u from TBUser u where u.userId = :userId")
  Optional<TBUser> findByIdWithLock(@Param("userId") Long userId);
}
