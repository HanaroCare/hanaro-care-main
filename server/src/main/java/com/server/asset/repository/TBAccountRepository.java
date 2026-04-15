package com.server.asset.repository;

import com.server.asset.entity.TBAccount;
import com.server.asset.entity.enums.AssetCategory;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TBAccountRepository extends JpaRepository<TBAccount, Long> {

  Optional<TBAccount> findByAccountId(Long accountId);

  @Query("""
          SELECT a.assetCateCd, SUM(a.balanceAmt)
          FROM TBAccount a
          WHERE a.user.userId = :userId
          GROUP BY a.assetCateCd
      """)
  List<Object[]> findBalanceSumGroupByCategoryByUserId(@Param("userId") Long userId);

  @Query("""
          SELECT SUM(a.balanceAmt)
          FROM TBAccount a
          WHERE a.user.userId = :userId
      """)
  BigDecimal findTotalBalanceByUserId(@Param("userId") Long userId);

  List<TBAccount> findAllByUser_UserIdAndAssetCateCdNot(Long userId, AssetCategory assetCategory);

  List<TBAccount> findAllByUser_UserIdAndAssetCateCd(Long userId, AssetCategory assetCategory);

  Optional<TBAccount> findByAccountIdAndAssetCateCd(Long insuranceId, AssetCategory assetCategory);
}
