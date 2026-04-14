package com.server.inheritance.repository;

import com.server.inheritance.entity.TBInheritLetter;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TBLetterRepository extends JpaRepository<TBInheritLetter, Long> {

  @Query("SELECT l FROM TBInheritLetter l WHERE l.detail.user.userId = :letterId")
  Optional<TBInheritLetter> findByUserId(Long letterId);
}
