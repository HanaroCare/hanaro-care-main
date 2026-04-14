package com.server.user.repository;

import com.server.user.entity.TBUser;
import com.server.user.entity.TBUserSimpleAuth;
import com.server.user.enums.LoginMeans;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TBUserSimpleAuthRepository extends JpaRepository<TBUserSimpleAuth, Long> {

  Optional<TBUserSimpleAuth> findByUserAndAuthMeansCd(TBUser user, LoginMeans authMeansCd);
}
