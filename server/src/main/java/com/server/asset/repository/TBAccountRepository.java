package com.server.asset.repository;

import com.server.asset.entity.TBAccount;
import com.server.asset.entity.enums.AssetCategory;
import com.server.user.entity.TBUser;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TBAccountRepository extends JpaRepository<TBAccount, Long> {
  List<TBAccount> findByUserAndAssetCateCd(TBUser user, AssetCategory assetCateCd);
}
