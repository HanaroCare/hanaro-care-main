package com.server.asset.repository;

import com.server.asset.entity.TBAccount;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<TBAccount, Long> {

  @Query("SELECT a FROM TBAccount a WHERE a.user.userId = :userId")
  List<TBAccount> findByUserId(Long userId);

  @Query("SELECT SUM(a.balanceAmt) FROM TBAccount a WHERE a.user.userId = :userId")
  BigDecimal findTotalBalanceByUserId(Long userId);

  @Query("SELECT a.assetCateCd, SUM(a.balanceAmt) FROM TBAccount a WHERE a.user.userId = :userId GROUP BY a.assetCateCd")
  List<Object[]> findBalanceSumGroupByCategoryByUserId(Long userId);
}
