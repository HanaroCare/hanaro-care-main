package com.server.asset.service;

import java.math.BigDecimal;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.asset.dto.link.RealAssetRequest;
import com.server.asset.entity.TBRealAsset;
import com.server.asset.entity.enums.RealAssetCategory;
import com.server.asset.repository.RealAssetRepository;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import com.server.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class RealAssetService {

	private final RealAssetRepository realAssetRepository;
	private final UserRepository userRepository;
	private final SimulationRefreshService simulationRefreshService;
	private final ObjectMapper objectMapper;

	/** 부동산 연동 */
	public Long linkHousing(Long userId, RealAssetRequest.HousingLinkRequest request) {
		// 1. 공통 컬럼에 들어갈 값은 뺀 나머지 '순수 상세 정보'만 Map으로 구성
		Map<String, Object> extraInfo = Map.of(
			"housing_type", request.getHousingType(),
			"acquisition_year", request.getAcquisitionYear(),
			"has_loan", request.getHasLoan()
		);

		TBRealAsset asset = TBRealAsset.builder()
			.user(userRepository.getReferenceById(userId))
			.assetNm("하나아파트")
			.addr(request.getAddr()) // 공통 컬럼 활용
			.assetSize(BigDecimal.valueOf(request.getAssetSize())) // 공통 컬럼 활용
			.evalAmt(new BigDecimal("920000000"))
			.assetCateCd(RealAssetCategory.REAL_ESTATE)
			.assetDesc(toJson(extraInfo)) // 중복 제외한 나머지만 JSON 저장
			.build();

		return saveAndEnqueue(userId, asset);
	}

	/** 자동차 연동 */
	public Long linkVehicle(Long userId, RealAssetRequest.VehicleLinkRequest request) {
		// [추가] 차량 번호 중복 체크
		// 동일 유저가 같은 차량 번호를 가진 자산을 이미 가지고 있는지 확인
		if (realAssetRepository.existsByUser_UserIdAndAssetDescContaining(userId, request.getCarNumber())) {
			throw new ApiException(ErrorStatus.REAL_ASSET_ALREADY_EXISTS);
		}

		// 역직렬화하기 좋게 Map으로 구성하여 JSON 저장
		Map<String, String> vehicleInfo = Map.of(
			"car_number", request.getCarNumber(),
			"model", "제네시스 G70",
			"details", "2022년식 · 32,000km"
		);

		TBRealAsset asset = TBRealAsset.builder()
			.user(userRepository.getReferenceById(userId))
			.assetNm("제네시스 G70")
			.evalAmt(new BigDecimal("46000000"))
			.assetCateCd(RealAssetCategory.VEHICLE)
			.assetDesc(toJson(vehicleInfo)) // JSON 문자열로 저장
			.build();

		return saveAndEnqueue(userId, asset);
	}

	/** 금 연동 */
	public Long linkGold(Long userId, RealAssetRequest.GoldLinkRequest request) {
		BigDecimal goldPricePerGram = new BigDecimal("138000");
		BigDecimal evalAmt = goldPricePerGram.multiply(BigDecimal.valueOf(request.getAssetSize()));

		TBRealAsset asset = TBRealAsset.builder()
			.user(userRepository.getReferenceById(userId))
			.assetNm("금 현물 (" + request.getPurity() + ")")
			.assetSize(BigDecimal.valueOf(request.getAssetSize()))
			.evalAmt(evalAmt)
			.assetCateCd(RealAssetCategory.GOLD)
			.assetDesc("함량: " + request.getPurity())
			.build();

		return saveAndEnqueue(userId, asset);
	}

	/** 연동 해제 */
	public void unlinkRealAsset(Long userId, Long realAssetId) {
		TBRealAsset asset = realAssetRepository.findByRealAssetIdAndUser_UserId(realAssetId, userId)
			.orElseThrow(() -> new ApiException(ErrorStatus.ASSET_NOT_FOUND));

		realAssetRepository.delete(asset);
		simulationRefreshService.enqueue(userId);
	}

	private Long saveAndEnqueue(Long userId, TBRealAsset asset) {
		Long savedId = realAssetRepository.save(asset).getRealAssetId();
		simulationRefreshService.enqueue(userId);
		return savedId;
	}

	private String toJson(Object obj) {
		try {
			return objectMapper.writeValueAsString(obj);
		} catch (JsonProcessingException e) { // 임포트가 없어서 발생했던 에러 해결
			log.error("JSON conversion error", e);
			return "";
		}
	}
}
