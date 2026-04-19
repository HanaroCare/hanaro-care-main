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

  boolean existsByLoginIdAndUserNm(String loginId, String userNm);

  boolean existsByUserNm(String userNm);

  boolean existsByLoginIdAndUserStatusCd(String loginId, UserStatus status);

  boolean existsByUserNmAndUserStatusCd(String userNm, UserStatus status);

  boolean existsByLoginIdAndUserNmAndUserStatusCd(String loginId, String userNm, UserStatus status);

  List<TBUser> findByUserNmAndUserStatusCd(String userNm, UserStatus status);

  List<TBUser> findAllByUserStatusCdNot(UserStatus status);

  Optional<TBUser> findFirstByLoginIdStartingWithAndAuthMeansCd(
      String loginIdPrefix, LoginMeans authMeansCd);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select u from TBUser u where u.userId = :userId")
  Optional<TBUser> findByIdWithLock(@Param("userId") Long userId);

  @Query("SELECT u.userPhone FROM TBUser u WHERE u.userId = :userId")
  String findUserPhoneByUserId(Long userId);

  @Query("SELECT u.userNm FROM TBUser u WHERE u.userId = :userId")
  String findUserNmById(Long userId);

  @Query("""
      select u
      from TBUser u
      where lower(u.userNm) like lower(concat('%', :keyword, '%'))
         or lower(u.loginId) like lower(concat('%', :keyword, '%'))
         or u.userPhone like concat('%', :keyword, '%')
      order by u.userId desc
      """)
  List<TBUser> searchAdminUsers(@Param("keyword") String keyword);
}
