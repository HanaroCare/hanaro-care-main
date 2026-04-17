package com.server.asset.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.server.asset.entity.TBProduct;
import com.server.asset.entity.enums.ProdCate;

public interface ProductRepository extends JpaRepository<TBProduct, Long> {
	Optional<TBProduct> findFirstByProdCate(ProdCate prodCate);
}
