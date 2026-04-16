package com.server.user.repository;

import com.server.user.entity.TBUser;
import com.server.user.enums.UserStatus;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<TBUser, Long> {

  Optional<TBUser> findByLoginId(String loginId);

  boolean existsByLoginId(String loginId);

  Optional<TBUser> findByLoginIdAndUserPhone(String loginId, String userPhone);

  List<TBUser> findAllByUserStatusCdNot(UserStatus status);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select u from TBUser u where u.userId = :userId")
  Optional<TBUser> findByIdWithLock(@Param("userId") Long userId);

  @Query("SELECT u.userPhone FROM TBUser u WHERE u.userId = :userId")
  String findUserPhoneByUserId(Long userId);
}
