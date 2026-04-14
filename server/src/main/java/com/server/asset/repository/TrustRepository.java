package com.server.asset.repository;

import com.server.asset.entity.TBTrustSimulation;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrustRepository extends JpaRepository<TBTrustSimulation, Long> {
	Optional<TBTrustSimulation> findByUser_UserId(Long userId);
}
