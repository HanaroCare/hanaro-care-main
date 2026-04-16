package com.server.asset.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.server.asset.entity.TBRealAsset;

public interface RealAssetRepository extends JpaRepository<TBRealAsset, Long> {
	Optional<TBRealAsset> findByRealAssetIdAndUser_UserId(Long realAssetId, Long userId);
	List<TBRealAsset> findAllByUser_UserId(Long userId);
	Optional<TBRealAsset> findByRealAssetId(Long realAssetId);

	@Query(value = "SELECT COUNT(*) > 0 FROM TB_REAL_ASSET " +
		"WHERE USER_ID = :userId " +
		"AND JSON_EXTRACT(ASSET_DESC, '$.car_number') = :carNumber",
		nativeQuery = true)
	boolean existsByCarNumber(@Param("userId") Long userId, @Param("carNumber") String carNumber);
}
