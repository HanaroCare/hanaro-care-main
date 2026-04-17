package com.server.asset.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.server.BaseRepositoryTest;
import com.server.asset.entity.TBProduct;
import com.server.asset.entity.enums.ProdCate;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.Sql.ExecutionPhase;

@DisplayName("ProductRepository 테스트")
@Sql(
	statements = {
		"SET REFERENTIAL_INTEGRITY FALSE",
		"TRUNCATE TABLE TB_ASSET_TRANS",
		"TRUNCATE TABLE TB_USER_PROD",
		"TRUNCATE TABLE TB_PRODUCT",
		"SET REFERENTIAL_INTEGRITY TRUE"
	},
	executionPhase = ExecutionPhase.BEFORE_TEST_METHOD
)
class ProductRepositoryTest extends BaseRepositoryTest {

	@Autowired
	private ProductRepository productRepository;

	@Test
	@DisplayName("상품 카테고리로 상품 조회")
	void findByProdCateTest() {
		// given
		TBProduct product = productRepository.save(
			TBProduct.builder()
				.prodCate(ProdCate.PENSION)
				.prodNm("예금상품")
				.prodDesc("예금상품설명")
				.build()
		);

		// when
		Optional<TBProduct> result = productRepository.findByProdCate(ProdCate.PENSION);

		// then
		assertThat(result).isPresent();
		assertThat(result.get().getProductId()).isEqualTo(product.getProductId());
		assertThat(result.get().getProdCate()).isEqualTo(ProdCate.PENSION);
		assertThat(result.get().getProdNm()).isEqualTo("예금상품");
	}

	@Test
	@DisplayName("존재하지 않는 상품 카테고리 조회 시 empty 반환")
	void findByProdCateNotFoundTest() {
		// when
		Optional<TBProduct> result = productRepository.findByProdCate(ProdCate.PENSION);

		// then
		assertThat(result).isEmpty();
	}
}
