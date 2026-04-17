package com.server.asset.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.server.BaseRepositoryTest;
import com.server.asset.entity.TBRealAsset;
import com.server.asset.entity.enums.RealAssetCategory;
import com.server.user.entity.TBUser;
import com.server.user.enums.LoginMeans;
import com.server.user.enums.UserStatus;
import com.server.user.repository.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;

@Rollback(true)
@DisplayName("RealAssetRepository 테스트")
class RealAssetRepositoryTest extends BaseRepositoryTest {

	@Autowired
	private RealAssetRepository realAssetRepository;

	@Autowired
	private UserRepository userRepository;

	private TBUser user;
	private TBRealAsset realAsset1;
	private TBRealAsset realAsset2;

	@BeforeEach
	void setUp() {
		user = userRepository.save(
			TBUser.builder()
				.loginId("real_asset_user")
				.userNm("실물자산유저")
				.userAge(50)
				.userPhone("01022223333")
				.userPwd("password")
				.userStatusCd(UserStatus.ACTIVE)
				.authMeansCd(LoginMeans.PASSWORD)
				.isHanaCert(true)
				.build()
		);

		realAsset1 = realAssetRepository.save(
			TBRealAsset.builder()
				.user(user)
				.assetCateCd(RealAssetCategory.REAL_ESTATE)
				.assetNm("강남아파트")
				.evalAmt(new BigDecimal("1000000000"))
				.addr("서울 강남구")
				.assetSize(new BigDecimal("84.50"))
				.assetDesc("첫번째 자산")
				.build()
		);

		realAsset2 = realAssetRepository.save(
			TBRealAsset.builder()
				.user(user)
				.assetCateCd(RealAssetCategory.REAL_ESTATE)
				.assetNm("서초오피스텔")
				.evalAmt(new BigDecimal("600000000"))
				.addr("서울 서초구")
				.assetSize(new BigDecimal("59.10"))
				.assetDesc("두번째 자산")
				.build()
		);
	}

	@Test
	@DisplayName("실물자산 ID와 사용자 ID로 조회")
	void findByRealAssetIdAndUser_UserIdTest() {
		// when
		Optional<TBRealAsset> result =
			realAssetRepository.findByRealAssetIdAndUser_UserId(realAsset1.getRealAssetId(), user.getUserId());

		// then
		assertThat(result).isPresent();
		assertThat(result.get().getAssetNm()).isEqualTo("강남아파트");
	}

	@Test
	@DisplayName("사용자 ID로 전체 실물자산 조회")
	void findAllByUser_UserIdTest() {
		// when
		List<TBRealAsset> result = realAssetRepository.findAllByUser_UserId(user.getUserId());

		// then
		assertThat(result).hasSize(2);
	}

	@Test
	@DisplayName("실물자산 ID로 조회")
	void findByRealAssetIdTest() {
		// when
		Optional<TBRealAsset> result = realAssetRepository.findByRealAssetId(realAsset1.getRealAssetId());

		// then
		assertThat(result).isPresent();
		assertThat(result.get().getRealAssetId()).isEqualTo(realAsset1.getRealAssetId());
	}

	@Test
	@DisplayName("사용자 ID와 자산 카테고리로 전체 조회")
	void findAllByUser_UserIdAndAssetCateCdTest() {
		// when
		List<TBRealAsset> result =
			realAssetRepository.findAllByUser_UserIdAndAssetCateCd(user.getUserId(), RealAssetCategory.REAL_ESTATE);

		// then
		assertThat(result).hasSize(2);
	}

	@Test
	@DisplayName("존재하지 않는 실물자산 ID와 사용자 ID 조회 시 empty 반환")
	void findByRealAssetIdAndUser_UserIdNotFoundTest() {
		// when
		Optional<TBRealAsset> result =
			realAssetRepository.findByRealAssetIdAndUser_UserId(999999999L, user.getUserId());

		// then
		assertThat(result).isEmpty();
	}
}
