package com.server.user.repository;

import com.server.user.entity.TBUser;
import com.server.user.enums.LoginMeans;
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

  Optional<TBUser> findByUserNmAndUserPhone(String userNm, String userPhone);

  List<TBUser> findAllByUserStatusCdNot(UserStatus status);

  /**
   * loginId 가 특정 접두사로 시작하고 authMeansCd 가 일치하는 첫 번째 유저를 조회합니다.
   * 프론트에서 "Tsid" 같은 공통 식별자를 전달했을 때 수단별로 실제 계정을 찾기 위해 사용됩니다.
   */
  Optional<TBUser> findFirstByLoginIdStartingWithAndAuthMeansCd(
      String loginIdPrefix, LoginMeans authMeansCd);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select u from TBUser u where u.userId = :userId")
  Optional<TBUser> findByIdWithLock(@Param("userId") Long userId);

  @Query("SELECT u.userPhone FROM TBUser u WHERE u.userId = :userId")
  String findUserPhoneByUserId(Long userId);

  @Query("SELECT u.userNm FROM TBUser u WHERE u.userId = :userId")
  String findUserNmById(Long userId);
}
