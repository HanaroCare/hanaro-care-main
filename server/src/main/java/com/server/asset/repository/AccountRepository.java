package com.server.asset.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.server.asset.entity.TBAccount;
import com.server.asset.entity.enums.AssetCategory;

public interface AccountRepository extends JpaRepository<TBAccount, Long> {

  List<TBAccount> findByUser_UserIdAndAssetCateCd(Long userId, AssetCategory assetCateCd);
  List<TBAccount> findByUser_UserIdAndAssetCateCdIn(Long userId, List<AssetCategory> categories);

  @Query("""
          SELECT SUM(a.balanceAmt)
          FROM TBAccount a
          WHERE a.user.userId = :userId
      """)
  BigDecimal findTotalBalanceByUserId(@Param("userId") Long userId);

  Optional<TBAccount> findByAccountIdAndAssetCateCd(Long insuranceId, AssetCategory assetCategory);

  List<TBAccount> findAllByUser_UserId(Long userId);

  @Query("SELECT SUM(a.balanceAmt) FROM TBAccount a WHERE a.user.userId = :userId AND a.isLinked = true")
  BigDecimal findTotalBalanceByUserIdAndIsLinkedTrue(@Param("userId") Long userId);

  @Query("SELECT a.assetCateCd, SUM(a.balanceAmt) FROM TBAccount a WHERE a.user.userId = :userId AND a.isLinked = true GROUP BY a.assetCateCd")
  List<Object[]> findBalanceSumGroupByCategoryByUserIdAndIsLinkedTrue(@Param("userId") Long userId);

  List<TBAccount> findAllByUser_UserIdAndAssetCateCdNotAndIsLinkedTrue(Long userId,
      AssetCategory category);

  List<TBAccount> findByUser_UserIdAndAssetCateCdAndIsLinkedTrue(Long userId,
      AssetCategory category);

  boolean existsByUser_UserIdAndIsLinkedTrue(Long userId);
}
