package com.server.asset.repository;

import com.server.asset.entity.TBPensionSimulation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PensionSimulationRepository extends JpaRepository<TBPensionSimulation, Long> {

	Optional<TBPensionSimulation> findByRealAsset_RealAssetId(Long realAssetId);
	boolean existsByRealAsset_User_UserId(Long userId);
}
