package com.server.inheritance.repository;

import com.server.inheritance.entity.TBInheritDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InheritDetailRepository extends JpaRepository<TBInheritDetail, Long> {

}
