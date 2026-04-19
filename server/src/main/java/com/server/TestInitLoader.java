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
	}
}
