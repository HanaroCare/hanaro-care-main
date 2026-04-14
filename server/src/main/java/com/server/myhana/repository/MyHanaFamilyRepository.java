package com.server.myhana.repository;

import com.server.user.entity.TBFamilyAuth;
import com.server.user.entity.TBUser;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MyHanaFamilyRepository extends JpaRepository<TBFamilyAuth, Long> {
    // 특정 사용자가 등록한 가족 목록 중 승인된 가족만 조회
    List<TBFamilyAuth> findAllByGrantorAndAuthStatusTrue(TBUser grantor);
    
    // 특정 사용자가 받은 초대 목록 조회
    List<TBFamilyAuth> findAllByGranteeAndAuthStatusFalse(TBUser grantee);
    
    // 초대 수락을 위해 특정 발신자와 수신자 사이의 초대 기록 조회
    Optional<TBFamilyAuth> findByGrantorAndGranteeAndAuthStatusFalse(TBUser grantor, TBUser grantee);

    // 이미 존재하는 관계인지 확인 (초대 중복 방지 등)
    Optional<TBFamilyAuth> findByGrantorAndGrantee(TBUser grantor, TBUser grantee);
}
