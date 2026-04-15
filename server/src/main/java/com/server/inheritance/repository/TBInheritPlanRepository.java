package com.server.inheritance.repository;

import com.server.inheritance.entity.TBInheritPlan;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TBInheritPlanRepository extends JpaRepository<TBInheritPlan, Long> {

  Optional<TBInheritPlan> findByUser_UserId(Long userId);
}
