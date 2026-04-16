package com.server.inheritance.repository;

import com.server.inheritance.entity.TBInheritDetail;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface InheritDetailRepository extends JpaRepository<TBInheritDetail, Long> {

  @Query("SELECT d FROM TBInheritDetail d WHERE d.inheritPlan.id = :inheritPlanId")
  List<TBInheritDetail> findByInheritPlanId(Long inheritPlanId);

  boolean existsByUser_UserId(Long userId);

  Optional<TBInheritDetail> findByUser_UserId(Long userId);

  List<TBInheritDetail> findAllByInheritPlan_Id(Long id);
}
