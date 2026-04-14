package com.server.asset.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.server.asset.entity.TBRealAsset;
import com.server.asset.entity.enums.RealAssetCategory;

public interface TBRealAssetRepository extends JpaRepository<TBRealAsset, Long> {
	List<TBRealAsset> findAllByUser_UserIdAndAssetCateCd(Long userId, RealAssetCategory assetCateCd);

	@Query("""
        SELECT r.assetCateCd, SUM(r.evalAmt)
        FROM TBRealAsset r
        WHERE r.user.userId = :userId
        GROUP BY r.assetCateCd
    """)
	List<Object[]> findEvalAmtSumGroupByCategoryByUserId(@Param("userId") Long userId);
}
