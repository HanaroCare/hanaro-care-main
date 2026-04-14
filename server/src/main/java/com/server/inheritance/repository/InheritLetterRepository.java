package com.server.inheritance.repository;

import com.server.inheritance.entity.TBInheritLetter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InheritLetterRepository extends JpaRepository<TBInheritLetter, Long> {

}
