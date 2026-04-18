package com.server.card.repository;

import com.server.card.entity.TBCardUsage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CardUsageRepository extends JpaRepository<TBCardUsage, Long> {

  List<TBCardUsage> findByCard_CardIdOrderByCreatedAtDesc(Long cardId);

  @Query("SELECT DISTINCT u.card.cardId FROM TBCardUsage u WHERE u.card.account.user.userId = :userId AND u.abnmlYn = 'Y'")
  List<Long> findAbnormalCardIdsByUserId(@Param("userId") Long userId);
}
