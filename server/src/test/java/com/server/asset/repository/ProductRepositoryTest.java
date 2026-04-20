package com.server.asset.repository;


import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.server.BaseRepositoryTest;
import com.server.asset.entity.TBProduct;
import com.server.asset.entity.enums.ProdCate;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("ProductRepository 테스트")
class ProductRepositoryTest extends BaseRepositoryTest {

    @Autowired
    private ProductRepository repository;

    private TBProduct pensionProduct;
    private TBProduct trustProduct;

    @BeforeEach
    void setUp() {
        pensionProduct = repository.findFirstByProdCate(ProdCate.PENSION).orElseGet(() -> 
            repository.save(TBProduct.builder()
                .prodCate(ProdCate.PENSION)
                .prodNm("하나 연금신탁")
                .prodDesc("노후 대비 연금 상품")
                .build())
        );

        trustProduct = repository.findFirstByProdCate(ProdCate.TRUST).orElseGet(() ->
            repository.save(TBProduct.builder()
                .prodCate(ProdCate.TRUST)
                .prodNm("하나 유언대용신탁")
                .prodDesc("자산 관리 신탁 상품")
                .build())
        );
    }

    @Test
    @DisplayName("전체 상품 목록 조회 테스트")
    void findAllProductsTest() {
        List<TBProduct> products = repository.findAll();
        assertThat(products).hasSizeGreaterThanOrEqualTo(2);
    }

    @Test
    @DisplayName("ProdCate.PENSION 으로 상품 조회 테스트")
    void findByProdCatePensionTest() {
        Optional<TBProduct> found = repository.findFirstByProdCate(ProdCate.PENSION);
        assertThat(found).isPresent();
        assertThat(found.get().getProdCate()).isEqualTo(ProdCate.PENSION);
    }

    @Test
    @DisplayName("ProdCate.TRUST 으로 상품 조회 테스트")
    void findByProdCateTrustTest() {
        Optional<TBProduct> found = repository.findFirstByProdCate(ProdCate.TRUST);
        assertThat(found).isPresent();
        assertThat(found.get().getProdCate()).isEqualTo(ProdCate.TRUST);
    }

    @Test
    @DisplayName("ID로 연금 상품 단건 조회 테스트")
    void findByIdPensionTest() {
        Optional<TBProduct> found = repository.findById(pensionProduct.getProductId());
        assertThat(found).isPresent();
        assertThat(found.get().getProductId()).isEqualTo(pensionProduct.getProductId());
    }

    @Test
    @DisplayName("ID로 신탁 상품 단건 조회 테스트")
    void findByIdTrustTest() {
        Optional<TBProduct> found = repository.findById(trustProduct.getProductId());
        assertThat(found).isPresent();
        assertThat(found.get().getProductId()).isEqualTo(trustProduct.getProductId());
        assertThat(found.get().getProdCate()).isEqualTo(ProdCate.TRUST);
    }

    @Test
    @DisplayName("존재하지 않는 ID로 상품 조회 - 빈값 반환")
    void findByIdNotFoundTest() {
        Optional<TBProduct> found = repository.findById(999999L);
        assertThat(found).isEmpty();
    }
}
