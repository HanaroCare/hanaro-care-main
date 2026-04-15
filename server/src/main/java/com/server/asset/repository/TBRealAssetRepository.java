package com.server.asset.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.server.asset.entity.TBRealAsset;
import com.server.asset.entity.enums.RealAssetCategory;

public interface TBRealAssetRepository extends JpaRepository<TBRealAsset, Long> {
	List<TBRealAsset> findAllByUser_UserIdAndAssetCateCd(Long userId, RealAssetCategory assetCateCd);

	@Query("""
        SELECT r.assetCateCd, COALESCE(SUM(r.evalAmt), 0)
        FROM TBRealAsset r
        WHERE r.user.userId = :userId
        GROUP BY r.assetCateCd
    """)
	List<Object[]> findEvalAmtSumGroupByCategoryByUserId(@Param("userId") Long userId);

	Optional<TBRealAsset> findByRealAssetId(Long realAssetId);

}
