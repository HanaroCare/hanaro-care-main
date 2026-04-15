package com.server.user.repository;

import com.server.user.entity.TBFamilyAuth;
import jakarta.validation.constraints.NotNull;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TBFamilyAuthRepository extends JpaRepository<TBFamilyAuth, Long> {

  Optional<TBFamilyAuth> findByGrantor_UserIdAndGrantee_UserId(
      Long grantorUserId,
      Long granteeUserId
  );

  Boolean existsByGrantor_UserIdAndGrantee_UserId(Long grantorId, @NotNull Long granteeId);
}
