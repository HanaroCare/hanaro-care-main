package com.server.asset.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.server.asset.entity.TBAssetSimulation;

public interface TBAssetSimulationRepository extends JpaRepository<TBAssetSimulation, Long> {
}
