package com.server.asset.repository;

import com.server.asset.entity.TBProduct;
import com.server.asset.entity.enums.ProdCate;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<TBProduct, Long> {
	Optional<TBProduct> findByProdCateAndProdNm(ProdCate prodCate, String prodNm);
}
