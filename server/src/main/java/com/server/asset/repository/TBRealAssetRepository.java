package com.server.asset.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.server.asset.entity.TBRealAsset;
import com.server.asset.entity.enums.RealAssetCategory;

public interface TBRealAssetRepository extends JpaRepository<TBRealAsset, Long> {
	List<TBRealAsset> findAllByUser_UserIdAndAssetCateCd(Long userId, RealAssetCategory assetCateCd);
	List<TBRealAsset> findAllByUser_UserId(Long userId);

	Optional<TBRealAsset> findByRealAssetId(Long realAssetId);

}
