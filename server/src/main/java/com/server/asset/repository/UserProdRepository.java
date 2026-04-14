package com.server.asset.repository;

import java.util.Optional;

import com.server.asset.entity.TBUserProd;
import com.server.asset.entity.enums.ProdStat;
import com.server.asset.entity.enums.ProdType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProdRepository extends JpaRepository<TBUserProd, Long> {

  boolean existsByUser_UserIdAndProdTypeAndProdStat(Long userId, ProdType prodType, ProdStat prodStat);
  Optional<TBUserProd> findFirstByUser_UserIdOrderByCreatedAtDesc(Long userId);
}
