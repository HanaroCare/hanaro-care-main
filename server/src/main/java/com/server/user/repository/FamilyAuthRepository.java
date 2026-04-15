package com.server.user.repository;

import com.server.user.entity.TBFamilyAuth;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import org.springframework.data.repository.query.Param;

@Repository
public interface FamilyAuthRepository extends JpaRepository<TBFamilyAuth, Long> {

  Optional<TBFamilyAuth> findByGrantor_UserIdAndGrantee_UserId(
      Long grantorUserId,
      Long granteeUserId
  );
  // Find family members where the user is the grantor (gave permission)
  @Query("SELECT f FROM TBFamilyAuth f JOIN FETCH f.grantee WHERE f.grantor.userId = :userId")
  List<TBFamilyAuth> findApprovedFamilyByGrantorId(@Param("userId") Long userId);

  // Find family members where the user is the grantee (received permission)
  @Query("SELECT f FROM TBFamilyAuth f JOIN FETCH f.grantor WHERE f.grantee.userId = :userId")
  List<TBFamilyAuth> findApprovedFamilyByGranteeId(@Param("userId") Long userId);
}
