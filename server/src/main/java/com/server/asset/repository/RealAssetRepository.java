package com.server.asset.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.server.asset.entity.TBRealAsset;

public interface RealAssetRepository extends JpaRepository<TBRealAsset, Long> {
	Optional<TBRealAsset> findByRealAssetIdAndUser_UserId(Long realAssetId, Long userId);
	List<TBRealAsset> findAllByUser_UserId(Long userId);

	Optional<TBRealAsset> findByRealAssetId(Long realAssetId);

}
