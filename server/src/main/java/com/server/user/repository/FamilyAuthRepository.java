package com.server.user.repository;

import com.server.user.entity.TBFamilyAuth;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FamilyAuthRepository extends JpaRepository<TBFamilyAuth, Long> {

  /** 중복 데이터가 있어도 안전하게 가장 최신 1건만 반환 */
  Optional<TBFamilyAuth> findFirstByGrantor_UserIdAndGrantee_UserIdOrderByFamilyAuthIdDesc(
      Long grantorUserId,
      Long granteeUserId
  );

  @Query("SELECT f FROM TBFamilyAuth f JOIN FETCH f.grantee WHERE f.grantor.userId = :userId")
  List<TBFamilyAuth> findApprovedFamilyByGrantorId(@Param("userId") Long userId);

  @Query("SELECT f FROM TBFamilyAuth f JOIN FETCH f.grantor WHERE f.grantee.userId = :userId")
  List<TBFamilyAuth> findApprovedFamilyByGranteeId(@Param("userId") Long userId);

  List<TBFamilyAuth> findAllByGrantee_UserIdAndIsTrustViewTrue(Long granteeUserId);

  List<TBFamilyAuth> findAllByGrantee_UserId(Long granteeId);

  Boolean existsByGrantor_UserIdAndGrantee_UserId(Long grantorId, @NotNull Long granteeId);

  List<TBFamilyAuth> findAllByGrantor_UserIdAndRelationCd(Long grantorUserId, com.server.user.enums.FamilyRelation relationCd);

  List<TBFamilyAuth> findAllByGrantorUserId(Long userId);

  List<TBFamilyAuth> findAllByGrantee_UserIdAndIsInsView(Long userId, boolean isInsView);

  /** isInsView 조건 포함, 중복 안전 버전 */
  Optional<TBFamilyAuth> findFirstByGrantor_UserIdAndGrantee_UserIdAndIsInsViewOrderByFamilyAuthIdDesc(
      Long grantorId, Long granteeId, boolean isInsView);

  Boolean existsByGrantee_UserIdAndIsProxyClaimTrue(Long userId);

  List<TBFamilyAuth> findAllByGrantor_UserId(Long grantorId);

  List<TBFamilyAuth> findAllByGrantor_UserIdAndIsCardViewTrue(Long userId);

  List<TBFamilyAuth> findAllByGrantee_UserIdAndIsCardViewTrue(Long userId);

  void deleteAllByGrantor_UserIdOrGrantee_UserId(Long grantorId, Long granteeId);

  boolean existsByGrantee_UserIdAndGrantee_IsHanaCertFalse(Long granteeUserId);

  boolean existsByGrantor_UserId(Long grantorId);
}
