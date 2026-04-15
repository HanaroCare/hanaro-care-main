package com.server.card.repository;

import com.server.card.entity.TBCard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardRepository extends JpaRepository<TBCard, Long> {

}
