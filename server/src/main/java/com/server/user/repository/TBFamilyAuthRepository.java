package com.server.user.repository;

import com.server.user.entity.TBFamilyAuth;
import com.server.user.entity.TBUser;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TBFamilyAuthRepository extends JpaRepository<TBFamilyAuth, Long> {
  List<TBFamilyAuth> findByGrantor(TBUser grantor);
  List<TBFamilyAuth> findByGrantee(TBUser grantee);
}
