package com.server.card.repository;

import com.server.card.entity.TBCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CardRepository extends JpaRepository<TBCard, Long> {

    List<TBCard> findByAccount_User_UserIdAndIsUseTrue(Long userId);
}
