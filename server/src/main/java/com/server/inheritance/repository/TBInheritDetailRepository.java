package com.server.inheritance.repository;

import com.server.inheritance.entity.TBInheritDetail;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TBInheritDetailRepository extends JpaRepository<TBInheritDetail, Long> {

  boolean existsByUser_UserId(Long userId);

  Optional<TBInheritDetail> findByUser_UserId(Long userId);

  List<TBInheritDetail> findAllByInheritPlan_Id(Long id);
}
