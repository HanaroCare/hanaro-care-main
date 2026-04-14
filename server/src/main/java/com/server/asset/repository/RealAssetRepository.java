package com.server.asset.repository;

import com.server.asset.entity.TBRealAsset;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RealAssetRepository extends JpaRepository<TBRealAsset, Long> {

  @Query("SELECT r FROM TBRealAsset r WHERE r.user.userId = :userId")
  List<TBRealAsset> findByUserId(Long userId);
}
