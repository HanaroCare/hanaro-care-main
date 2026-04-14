package com.server.myhana.repository;

import com.server.user.entity.TBFamilyAuth;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MyHanaFamilyRepository extends JpaRepository<TBFamilyAuth, Long> {
    // 특정 사용자가 등록한 가족 목록 조회
    List<TBFamilyAuth> findAllByGrantor_UserId(Long grantorUserId);
    
    // 특정 사용자가 받은 가족 권한 목록 조회
    List<TBFamilyAuth> findAllByGrantee_UserId(Long granteeUserId);
    
    // 이미 존재하는 관계인지 확인
    Optional<TBFamilyAuth> findByGrantor_UserIdAndGrantee_UserId(Long grantorUserId, Long granteeUserId);
}
