package com.server.inheritance.repository;

import com.server.inheritance.entity.TBInheritPlan;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface InheritPlanRepository extends JpaRepository<TBInheritPlan, Long> {

  @Query("SELECT p FROM TBInheritPlan p WHERE p.user.userId = :userId")
  Optional<TBInheritPlan> findByUserId(Long userId);

  Optional<TBInheritPlan> findByUser_UserId(Long userId);
}
