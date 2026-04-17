package com.server.asset.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.server.BaseRepositoryTest;
import com.server.asset.entity.TBTrustSimulation;
import com.server.asset.entity.enums.InvestType;
import com.server.asset.entity.enums.PayoutType;
import com.server.asset.entity.enums.StartType;
import com.server.user.entity.TBUser;
import com.server.user.enums.LoginMeans;
import com.server.user.enums.UserStatus;
import com.server.user.repository.UserRepository;
import java.math.BigDecimal;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;

@Rollback(true)
@DisplayName("TrustRepository 테스트")
class TrustRepositoryTest extends BaseRepositoryTest {

	@Autowired
	private TrustRepository trustRepository;

	@Autowired
	private UserRepository userRepository;

	private TBUser user;

	@BeforeEach
	void setUp() {
		user = userRepository.save(
			TBUser.builder()
				.loginId("trust_user")
				.userNm("신탁유저")
				.userAge(55)
				.userPhone("01044445555")
				.userPwd("password")
				.userStatusCd(UserStatus.ACTIVE)
				.authMeansCd(LoginMeans.PASSWORD)
				.isHanaCert(true)
				.build()
		);
	}

	@Test
	@DisplayName("신탁 시뮬레이션 저장 후 userId로 조회 성공")
	void findByUser_UserIdTest() {
		// given
		TBTrustSimulation simulation = TBTrustSimulation.builder()
			.user(user)
			.principalAmount(new BigDecimal("50000000"))
			.startType(StartType.NOW)
			.investType(InvestType.LUMP_SUM)
			.payoutType(PayoutType.FLEXIBLE)
			.payoutSettings("{\"monthly\":1000000}")
			.build();
		trustRepository.save(simulation);

		// when
		Optional<TBTrustSimulation> result = trustRepository.findByUser_UserId(user.getUserId());

		// then
		assertThat(result).isPresent();
		assertThat(result.get().getPrincipalAmount()).isEqualByComparingTo("50000000");
		assertThat(result.get().getUser().getUserId()).isEqualTo(user.getUserId());
	}

	@Test
	@DisplayName("존재하지 않는 userId 조회 시 empty 반환")
	void findByUser_UserIdNotFoundTest() {
		// when
		Optional<TBTrustSimulation> result = trustRepository.findByUser_UserId(999999999L);

		// then
		assertThat(result).isEmpty();
	}
}
