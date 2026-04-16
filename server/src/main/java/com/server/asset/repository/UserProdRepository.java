package com.server.asset.repository;

import java.util.List;
import java.util.Optional;
import com.server.asset.entity.TBUserProd;
import com.server.asset.entity.enums.ProdCate;
import com.server.asset.entity.enums.ProdStat;
import com.server.asset.entity.enums.ProdType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProdRepository extends JpaRepository<TBUserProd, Long> {

  boolean existsByUser_UserIdAndProdTypeAndProdStat(Long userId, ProdType prodType, ProdStat prodStat);

  Optional<TBUserProd> findFirstByUser_UserIdAndProdTypeAndProdStatOrderByCreatedAtDesc(Long userId, ProdType prodType, ProdStat prodStat);

  Optional<TBUserProd> findFirstByUser_UserIdAndProduct_ProdCateAndProdStatOrderByCreatedAtDesc(
      Long userId,
      ProdCate prodCate,
      ProdStat prodStat
  );

  List<TBUserProd> findAllByProdTypeAndProdStat(ProdType prodType, ProdStat prodStat);
}
