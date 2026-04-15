package com.server.asset.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.server.asset.entity.TBAssetTrans;
import com.server.asset.entity.enums.TransType;

public interface TBAssetTransRepository extends JpaRepository<TBAssetTrans, Long> {

    @Query("SELECT t FROM TBAssetTrans t WHERE t.userProd.user.userId = :userId " +
           "AND t.transType = :transType AND t.transDt > :transDt")
    List<TBAssetTrans> findAllByUser_UserIdAndTransTypeAndTransDtAfter(
        @Param("userId") Long userId,
        @Param("transType") TransType transType,
        @Param("transDt") LocalDateTime transDt);
}
