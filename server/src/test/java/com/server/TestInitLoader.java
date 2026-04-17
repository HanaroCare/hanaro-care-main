package com.server;

import com.server.asset.entity.TBProduct;
import com.server.asset.entity.enums.ProdCate;
import com.server.asset.repository.ProductRepository;
import com.server.user.entity.TBUser;
import com.server.user.enums.LoginMeans;
import com.server.user.enums.SubscriberRole;
import com.server.user.enums.UserStatus;
import com.server.user.repository.UserRepository;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * 테스트 픽스처 초기화 로더
 *
 * <p>@Profile("test") 환경에서 ApplicationRunner로 실행되어
 * 공통 테스트 데이터(testUser, pensionProduct, trustProduct)를 생성합니다.
 *
 * <p><b>설계 원칙</b><br>
 * - saveAndFlush(): save() 후 즉시 SQL INSERT 실행 → 트랜잭션 커밋 전에도 DB에 반영됨<br>
 * - 멱등성 보장: loginId/ProdCate로 기존 데이터를 먼저 조회하여 중복 삽입 방지<br>
 * - 명시적 필드 설정: @Builder.Default 의존 없이 모든 필수 필드를 명시하여 누락 방지
 */
@Slf4j
@Component
@Profile("test")
@Getter
public class TestInitLoader implements ApplicationRunner {

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private ProductRepository productRepository;

  private TBUser testUser;
  private TBProduct pensionProduct;
  private TBProduct trustProduct;

  @Override
  @Transactional
  public void run(ApplicationArguments args) {
    log.info("[TestInitLoader] 테스트 픽스처 초기화 시작");

    initTestUser();
    initPensionProduct();
    initTrustProduct();

    log.info("[TestInitLoader] 완료 - testUser.userId={}, pensionProduct.productId={}, trustProduct.productId={}",
        testUser.getUserId(), pensionProduct.getProductId(), trustProduct.getProductId());
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 초기화 메서드
  // ─────────────────────────────────────────────────────────────────────────

  private void initTestUser() {
    // 멱등성: 이미 존재하면 재사용 (Context 캐싱 환경에서 중복 호출 방지)
    testUser = userRepository.findByLoginId("testuser01")
        .orElseGet(() -> {
          TBUser newUser = TBUser.builder()
              .loginId("testuser01")
              .userNm("테스트유저")
              .userAge(65)
              .userPhone("01012345678")
              .userAddr("서울시 강남구")
              .userPwd("encodedPwd123!")
              .userStatusCd(UserStatus.ACTIVE)
              // @Builder.Default 의존 없이 명시적 설정
              .authMeansCd(LoginMeans.PASSWORD)
              .userRole(SubscriberRole.ROLE_USER)
              .isHanaCert(false)
              .build();

          // saveAndFlush: 즉시 SQL INSERT 실행 → DB에 물리적으로 반영됨을 보장
          TBUser saved = userRepository.saveAndFlush(newUser);
          log.info("[TestInitLoader] testUser 신규 생성 완료: userId={}", saved.getUserId());
          return saved;
        });

    log.info("[TestInitLoader] testUser 확인: userId={}, loginId={}, userNm={}",
        testUser.getUserId(), testUser.getLoginId(), testUser.getUserNm());
  }

  private void initPensionProduct() {
    pensionProduct = productRepository.findByProdCate(ProdCate.PENSION)
        .orElseGet(() -> {
          TBProduct product = TBProduct.builder()
              .prodCate(ProdCate.PENSION)
              .prodNm("연금상품")
              .prodDesc("노후 대비 연금 상품")
              .build();
          return productRepository.saveAndFlush(product);
        });
  }

  private void initTrustProduct() {
    trustProduct = productRepository.findByProdCate(ProdCate.TRUST)
        .orElseGet(() -> {
          TBProduct product = TBProduct.builder()
              .prodCate(ProdCate.TRUST)
              .prodNm("신탁상품")
              .prodDesc("자산 관리 신탁 상품")
              .build();
          return productRepository.saveAndFlush(product);
        });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 테스트 전용 유틸리티 메서드
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * testUser의 userId를 안전하게 반환합니다.
   *
   * <p>이 메서드는 준영속(detached) 객체에서 ID 값만 추출하는 용도이며,
   * 반환된 Long 값은 모든 트랜잭션 컨텍스트에서 안전하게 사용할 수 있습니다.
   */
  public Long getTestUserId() {
    return testUser.getUserId();
  }
}
