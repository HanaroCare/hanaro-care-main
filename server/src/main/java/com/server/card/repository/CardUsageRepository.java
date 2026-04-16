package com.server.card.repository;

import com.server.card.entity.TBCardUsage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardUsageRepository extends JpaRepository<TBCardUsage, Long> {

  List<TBCardUsage> findByCard_CardIdOrderByCreatedAtDesc(Long cardId);
}
