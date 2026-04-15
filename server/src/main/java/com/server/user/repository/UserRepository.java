package com.server.user.repository;

import com.server.user.entity.TBUser;
import com.server.user.enums.UserStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<TBUser, Long> {

  Optional<TBUser> findByLoginId(String loginId);

  boolean existsByLoginId(String loginId);

  Optional<TBUser> findByLoginIdAndUserPhone(String loginId, String userPhone);

  List<TBUser> findAllByUserStatusCdNot(UserStatus status);
}