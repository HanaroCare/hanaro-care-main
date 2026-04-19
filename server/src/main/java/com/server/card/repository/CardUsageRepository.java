package com.server.card.repository;

import com.server.card.entity.TBCardUsage;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CardUsageRepository extends JpaRepository<TBCardUsage, Long> {

  List<TBCardUsage> findByCard_CardIdOrderByCreatedAtDesc(Long cardId);

  /** 활성 카드(isUse=true)의 이상 거래 카드 ID 목록 */
  @Query("SELECT DISTINCT u.card.cardId FROM TBCardUsage u WHERE u.card.account.user.userId = :userId AND u.abnmlYn = 'Y' AND u.card.isUse = true")
  List<Long> findAbnormalCardIdsByUserId(@Param("userId") Long userId);

  /** 활성 카드(isUse=true)의 가장 최근 이상 거래 */
  Optional<TBCardUsage> findTopByCard_Account_User_UserIdAndAbnmlYnAndCard_IsUseTrueOrderByCreatedAtDesc(Long userId, String abnmlYn);
}
