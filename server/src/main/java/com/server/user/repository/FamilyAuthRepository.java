package com.server.user.repository;

import com.server.user.entity.TBFamilyAuth;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FamilyAuthRepository extends JpaRepository<TBFamilyAuth, Long> {

  // Find family members where the user is the grantor (gave permission)
  @Query("SELECT f FROM TBFamilyAuth f JOIN FETCH f.grantee WHERE f.grantor.userId = :userId AND f.authStatus = true")
  List<TBFamilyAuth> findApprovedFamilyByGrantorId(Long userId);

  // Find family members where the user is the grantee (received permission)
  @Query("SELECT f FROM TBFamilyAuth f JOIN FETCH f.grantor WHERE f.grantee.userId = :userId AND f.authStatus = true")
  List<TBFamilyAuth> findApprovedFamilyByGranteeId(Long userId);
}
