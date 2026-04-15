package com.server.asset.repository;

import com.server.asset.entity.TBPensionSimulation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TBPensionSimulationRepository extends JpaRepository<TBPensionSimulation, Long> {

	Optional<TBPensionSimulation> findByRealAsset_RealAssetId(Long realAssetId);
}
