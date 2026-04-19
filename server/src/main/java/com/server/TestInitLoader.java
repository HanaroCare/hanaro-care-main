package com.server;

import com.server.asset.entity.TBAccount;
import com.server.asset.entity.TBProduct;
import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.entity.enums.ProdCate;
import com.server.asset.repository.AccountRepository;
import com.server.asset.repository.ProductRepository;
import com.server.card.entity.TBCard;
import com.server.card.repository.CardRepository;
import com.server.user.entity.TBFamilyAuth;
import com.server.user.entity.TBUser;
import com.server.user.enums.FamilyRelation;
import com.server.user.enums.LoginMeans;
import com.server.user.enums.SubscriberRole;
import com.server.user.enums.UserStatus;
import com.server.user.repository.FamilyAuthRepository;
import com.server.user.repository.UserRepository;
import java.math.BigDecimal;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Profile("test")
@Getter
public class TestInitLoader implements ApplicationRunner {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private AccountRepository accountRepository;

	@Autowired
	private FamilyAuthRepository familyAuthRepository;

	@Autowired
	private CardRepository cardRepository;

	private TBUser testUser;
	private TBProduct pensionProduct;
	private TBProduct trustProduct;

	@Override
	@Transactional
	public void run(ApplicationArguments args) {
		// 멱등성 보장: 이미 있으면 넘어가도록 설정 (중복 에러 방지)
		testUser = userRepository.findByLoginId("testuser01").orElseGet(() ->
			userRepository.save(TBUser.builder()
				.loginId("testuser01")
				.userNm("테스트유저")
				.userAge(65)
				.userPhone("01012345678")
				.userAddr("서울시 강남구")
				.userPwd("encodedPwd123!")
				.userStatusCd(UserStatus.ACTIVE)
				.authMeansCd(LoginMeans.PASSWORD)
				.userRole(SubscriberRole.ROLE_USER)
				.isHanaCert(false)
				.build())
		);

		// 가족 수락 시 카드 생성에 필요한 더미 계좌 — 없을 때만 생성
		boolean hasAccount = !accountRepository.findAllByUser_UserId(testUser.getUserId()).isEmpty();
		if (!hasAccount) {
			accountRepository.save(TBAccount.builder()
				.user(testUser)
				.instNm("하나은행")
				.accountNm("테스트 입출금 계좌")
				.accountNum("123-456789-01234")
				.balanceAmt(new BigDecimal("5000000"))
				.assetCateCd(AssetCategory.CASH)
				.isLinked(true)
				.build());
		}

		pensionProduct = productRepository.findFirstByProdCate(ProdCate.PENSION).orElseGet(() ->
			productRepository.save(TBProduct.builder()
				.prodCate(ProdCate.PENSION)
				.prodNm("연금상품")
				.prodDesc("노후 대비 연금 상품")
				.build())
		);

		trustProduct = productRepository.findFirstByProdCate(ProdCate.TRUST).orElseGet(() ->
			productRepository.save(TBProduct.builder()
				.prodCate(ProdCate.TRUST)
				.prodNm("신탁상품")
				.prodDesc("자산 관리 신탁 상품")
				.build())
		);

		// 가족 관계 초기화 (data.sql 대신 동적으로 생성 — 멱등성 보장)
		// data.sql의 카드(4001, 4002)를 findById로 참조
		TBUser hong    = userRepository.findByLoginId("hong123").orElse(null);
		TBUser chulsoo = userRepository.findByLoginId("chulsoo7").orElse(null);
		TBUser jung8   = userRepository.findByLoginId("jung8").orElse(null);
		TBUser minjun  = userRepository.findByLoginId("minjun9").orElse(null);
		TBUser testAdmin = userRepository.findByLoginId("testUser").orElse(null);

		TBCard card4001 = cardRepository.findById(4001L).orElse(null);
		TBCard card4002 = cardRepository.findById(4002L).orElse(null);

		// (1) 홍길동 → 김철수 (CHILD), 전체 권한 ON, 카드 4001
		createFamilyAuthIfAbsent(hong, chulsoo, FamilyRelation.CHILD, true, true, true, true, card4001);
		// (2) 홍길동 → 박관리 (CHILD), 전체 권한 ON, 카드 4002
		createFamilyAuthIfAbsent(hong, testAdmin, FamilyRelation.CHILD, true, true, true, true, card4002);
		// (3) 홍길동 → 정순자 (PARENT), 전체 권한 ON, 카드 4001
		createFamilyAuthIfAbsent(hong, jung8, FamilyRelation.PARENT, true, true, true, true, card4001);
		// (4) 정순자 → 정민준 (CHILD), 전체 권한 OFF, 카드 없음
		createFamilyAuthIfAbsent(jung8, minjun, FamilyRelation.CHILD, false, false, false, false, null);
	}

	/** 이미 동일한 grantor→grantee 관계가 있으면 추가 저장하지 않음 */
	private void createFamilyAuthIfAbsent(
		TBUser grantor, TBUser grantee,
		FamilyRelation relation,
		boolean isInsView, boolean isCardView, boolean isProxyClaim, boolean isTrustView,
		TBCard card
	) {
		if (grantor == null || grantee == null) return;
		boolean exists = familyAuthRepository.existsByGrantor_UserIdAndGrantee_UserId(
			grantor.getUserId(), grantee.getUserId());
		if (!exists) {
			familyAuthRepository.save(TBFamilyAuth.builder()
				.grantor(grantor)
				.grantee(grantee)
				.relationCd(relation)
				.isInsView(isInsView)
				.isCardView(isCardView)
				.isProxyClaim(isProxyClaim)
				.isTrustView(isTrustView)
				.card(card)
				.build());
		}
	}
}
