package com.server.asset.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.server.asset.entity.TBAssetSimulation;
import com.server.asset.entity.enums.CareType;

public interface TBAssetSimulationRepository extends JpaRepository<TBAssetSimulation, Long> {
    Optional<TBAssetSimulation> findFirstByUser_UserIdOrderByCreatedAtDesc(Long userId);
    Optional<TBAssetSimulation> findFirstByUser_UserIdAndTargetAgeAndCareTypeOrderByCreatedAtDesc(Long userId, Integer targetAge, CareType careType);
}
