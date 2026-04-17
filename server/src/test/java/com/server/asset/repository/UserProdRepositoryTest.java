package com.server.asset.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.server.BaseRepositoryTest;
import com.server.asset.entity.TBProduct;
import com.server.asset.entity.TBUserProd;
import com.server.asset.entity.enums.PayoutType;
import com.server.asset.entity.enums.ProdCate;
import com.server.asset.entity.enums.ProdStat;
import com.server.asset.entity.enums.ProdType;
import com.server.user.entity.TBUser;
import com.server.user.enums.LoginMeans;
import com.server.user.enums.UserStatus;
import com.server.user.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.Sql.ExecutionPhase;

@DisplayName("UserProdRepository 테스트")
@Sql(
	statements = {
		"SET REFERENTIAL_INTEGRITY FALSE",
		"TRUNCATE TABLE TB_ASSET_TRANS",
		"TRUNCATE TABLE TB_USER_PROD",
		"TRUNCATE TABLE TB_PRODUCT",
		"TRUNCATE TABLE TB_USER",
		"SET REFERENTIAL_INTEGRITY TRUE"
	},
	executionPhase = ExecutionPhase.BEFORE_TEST_METHOD
)
class UserProdRepositoryTest extends BaseRepositoryTest {

	@Autowired
	private UserProdRepository userProdRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ProductRepository productRepository;

	private TBUser user;
	private TBProduct product;

	@BeforeEach
	void setUp() {
		user = userRepository.save(
			TBUser.builder()
				.loginId("u" + System.nanoTime())
				.userNm("유저상품유저")
				.userAge(42)
				.userPhone("01077778888")
				.userPwd("password")
				.userStatusCd(UserStatus.ACTIVE)
				.authMeansCd(LoginMeans.PASSWORD)
				.isHanaCert(true)
				.build()
		);

		product = productRepository.save(
			TBProduct.builder()
				.prodCate(ProdCate.TRUST)
				.prodNm("예금상품")
				.prodDesc("예금설명")
				.build()
		);
	}

	@Test
	void findAllByProdTypeAndProdStatTest() {
		userProdRepository.save(
			TBUserProd.builder()
				.user(user)
				.product(product)
				.prodType(ProdType.TRUST)
				.payoutType(PayoutType.FLEXIBLE)
				.prodStat(ProdStat.IN_PROGRESS)
				.isAgentView(false)
				.build()
		);

		List<TBUserProd> result =
			userProdRepository.findAllByProdTypeAndProdStat(ProdType.TRUST, ProdStat.IN_PROGRESS);

		assertThat(result)
			.anyMatch(p -> p.getUser().getUserId().equals(user.getUserId()));
	}
}
