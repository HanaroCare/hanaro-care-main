package com.server.myhana.repository;

import com.server.myhana.entity.TBSharedInsurance;
import com.server.user.entity.TBUser;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SharedInsuranceRepository extends JpaRepository<TBSharedInsurance, Long> {
  List<TBSharedInsurance> findByGrantorAndGrantee(TBUser grantor, TBUser grantee);
  void deleteByGrantorAndGrantee(TBUser grantor, TBUser grantee);
}
