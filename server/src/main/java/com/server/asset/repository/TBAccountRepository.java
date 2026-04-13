package com.server.asset.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.server.asset.entity.TBAccount;

public interface TBAccountRepository extends JpaRepository<TBAccount, Long> {
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
}
