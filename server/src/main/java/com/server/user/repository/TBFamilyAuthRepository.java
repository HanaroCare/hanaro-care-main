package com.server.user.repository;

import com.server.user.entity.TBFamilyAuth;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TBFamilyAuthRepository extends JpaRepository<TBFamilyAuth, Long> {
  
  Boolean existsByGrantor_UserIdAndGrantee_UserId(Long grantorId, @NotBlank Long granteeId);

  List<TBFamilyAuth> findAllByGranteeUserIdAndIsInsView(Long userId, boolean isInsView);

  Optional<TBFamilyAuth> findByGrantorUserIdAndGranteeUserIdAndIsInsView(Long accountOwnerId,
      Long userId, boolean b);

  List<TBFamilyAuth> findAllByGrantorUserId(Long userId);
}
