package com.server.card.repository;

import com.server.card.entity.TBCard;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardRepository extends JpaRepository<TBCard, Long> {

  List<TBCard> findAllByAccount_User_UserId(Long userId);

  List<TBCard> findByAccount_User_UserIdAndIsUseTrue(Long userId);
}
