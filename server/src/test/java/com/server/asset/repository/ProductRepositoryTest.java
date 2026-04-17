package com.server.asset.repository;

import static org.assertj.core.api.Assertions.*;

import com.server.BaseRepositoryTest;
import com.server.TestInitLoader;
import com.server.asset.entity.TBProduct;
import com.server.asset.entity.enums.ProdCate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class ProductRepositoryTest extends BaseRepositoryTest {

    private static long orgCount = 0;
    private static TBProduct pensionProduct;
    private static TBProduct trustProduct;

    @Autowired
    private TestInitLoader initLoader;

    @Autowired
    private ProductRepository repository;

    @BeforeEach
    void setUp() {
        if (orgCount == 0)
            orgCount = repository.count();
        if (pensionProduct == null)
            pensionProduct = initLoader.getPensionProduct();
        if (trustProduct == null)
            trustProduct = initLoader.getTrustProduct();
    }

    @Test
    @DisplayName("TestInitLoader로 저장된 상품 개수 확인")
    @Order(1)
    void countProductsTest() {
        assertThat(repository.count()).isGreaterThanOrEqualTo(2);
    }

    @Test
    @DisplayName("전체 상품 목록 조회 테스트")
    @Order(2)
    void findAllProductsTest() {
        List<TBProduct> products = repository.findAll();
        assertThat(products).isNotEmpty();
        assertThat(products).hasSizeGreaterThanOrEqualTo(2);
    }

    @Test
    @DisplayName("ProdCate.PENSION 으로 상품 조회 테스트")
    @Order(3)
    void findByProdCatePensionTest() {
        Optional<TBProduct> found = repository.findByProdCate(ProdCate.PENSION);
        assertThat(found).isPresent();
        assertThat(found.get().getProdCate()).isEqualTo(ProdCate.PENSION);
        assertThat(found.get().getProdNm()).isEqualTo("연금상품");
    }

    @Test
    @DisplayName("ProdCate.TRUST 으로 상품 조회 테스트")
    @Order(4)
    void findByProdCateTrustTest() {
        Optional<TBProduct> found = repository.findByProdCate(ProdCate.TRUST);
        assertThat(found).isPresent();
        assertThat(found.get().getProdCate()).isEqualTo(ProdCate.TRUST);
        assertThat(found.get().getProdNm()).isEqualTo("신탁상품");
    }

    @Test
    @DisplayName("ID로 연금 상품 단건 조회 테스트")
    @Order(5)
    void findByIdPensionTest() {
        Optional<TBProduct> found = repository.findById(pensionProduct.getProductId());
        assertThat(found).isPresent();
        assertThat(found.get().getProductId()).isEqualTo(pensionProduct.getProductId());
    }

    @Test
    @DisplayName("ID로 신탁 상품 단건 조회 테스트")
    @Order(6)
    void findByIdTrustTest() {
        Optional<TBProduct> found = repository.findById(trustProduct.getProductId());
        assertThat(found).isPresent();
        assertThat(found.get().getProdCate()).isEqualTo(ProdCate.TRUST);
    }

    @Test
    @DisplayName("존재하지 않는 ID로 상품 조회 - 빈값 반환")
    @Order(7)
    void findByIdNotFoundTest() {
        Optional<TBProduct> found = repository.findById(999999L);
        assertThat(found).isEmpty();
    }
}