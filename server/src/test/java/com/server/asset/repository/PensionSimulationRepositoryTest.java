package com.server.asset.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.server.BaseRepositoryTest;
import com.server.asset.entity.TBPensionSimulation;
import com.server.asset.entity.TBRealAsset;
import com.server.asset.entity.enums.PensionPayoutType;
import com.server.asset.entity.enums.RealAssetCategory;
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
@DisplayName("PensionSimulationRepository 테스트")
class PensionSimulationRepositoryTest extends BaseRepositoryTest {

	@Autowired
	private PensionSimulationRepository pensionSimulationRepository;

	@Autowired
	private RealAssetRepository realAssetRepository;

	@Autowired
	private UserRepository userRepository;

	private TBUser user;
	private TBRealAsset realAsset;

	@BeforeEach
	void setUp() {
		user = userRepository.save(
			TBUser.builder()
				.loginId("pension_user")
				.userNm("연금유저")
				.userAge(45)
				.userPhone("01011112222")
				.userPwd("password")
				.userStatusCd(UserStatus.ACTIVE)
				.authMeansCd(LoginMeans.PASSWORD)
				.isHanaCert(true)
				.build()
		);

		realAsset = realAssetRepository.save(
			TBRealAsset.builder()
				.user(user)
				.assetCateCd(RealAssetCategory.REAL_ESTATE)
				.assetNm("테스트아파트")
				.evalAmt(new BigDecimal("700000000"))
				.addr("서울시 강남구")
				.assetSize(new BigDecimal("84.50"))
				.assetDesc("테스트용 부동산")
				.build()
		);
	}

	@Test
	@DisplayName("실물자산 ID로 연금 시뮬레이션 조회")
	void findByRealAsset_RealAssetIdTest() {
		// given
		TBPensionSimulation simulation = TBPensionSimulation.builder()
			.realAsset(realAsset)
			.recommendedType(PensionPayoutType.FIXED)
			.recommendedMonthlyAmt(new BigDecimal("1500000"))
			.recommendedCumulativeAmt(new BigDecimal("360000000"))
			.evalAmtSnapshot(new BigDecimal("700000000"))
			.plansJson("{\"plan\":\"sample\"}")
			.build();
		pensionSimulationRepository.save(simulation);

		// when
		Optional<TBPensionSimulation> result =
			pensionSimulationRepository.findByRealAsset_RealAssetId(realAsset.getRealAssetId());

		// then
		assertThat(result).isPresent();
		assertThat(result.get().getRealAsset().getRealAssetId()).isEqualTo(realAsset.getRealAssetId());
		assertThat(result.get().getRecommendedMonthlyAmt()).isEqualByComparingTo("1500000");
	}

	@Test
	@DisplayName("존재하는 사용자의 연금 시뮬레이션 존재 여부 확인")
	void existsByRealAsset_User_UserIdTest() {
		// given
		pensionSimulationRepository.save(
			TBPensionSimulation.builder()
				.realAsset(realAsset)
				.recommendedType(PensionPayoutType.FRONT_LOADED)
				.recommendedMonthlyAmt(new BigDecimal("1700000"))
				.recommendedCumulativeAmt(new BigDecimal("400000000"))
				.evalAmtSnapshot(new BigDecimal("700000000"))
				.plansJson("{\"plan\":\"exists\"}")
				.build()
		);

		// when
		boolean exists = pensionSimulationRepository.existsByRealAsset_User_UserId(user.getUserId());

		// then
		assertThat(exists).isTrue();
	}

	@Test
	@DisplayName("존재하지 않는 사용자의 연금 시뮬레이션 존재 여부 확인")
	void existsByRealAsset_User_UserIdFalseTest() {
		// when
		boolean exists = pensionSimulationRepository.existsByRealAsset_User_UserId(999999999L);

		// then
		assertThat(exists).isFalse();
	}
}
