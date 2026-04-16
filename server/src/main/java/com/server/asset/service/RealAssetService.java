package com.server.asset.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException; // 추가: 예외 임포트
import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.asset.dto.link.RealAssetRequest;
import com.server.asset.entity.TBRealAsset;
import com.server.asset.entity.enums.RealAssetCategory; // 이 엔티티에 VEHICLE이 있어야 함
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
		BigDecimal evalAmt = new BigDecimal("920000000");

		String desc = toJson(request);

		TBRealAsset asset = TBRealAsset.builder()
			.user(userRepository.getReferenceById(userId))
			.assetNm("하나아파트")
			.addr(request.getAddr())
			.assetSize(BigDecimal.valueOf(request.getAssetSize()))
			.evalAmt(evalAmt)
			.assetCateCd(RealAssetCategory.REAL_ESTATE)
			.assetDesc(desc)
			.build();

		return saveAndEnqueue(userId, asset);
	}

	/** 자동차 연동 */
	public Long linkVehicle(Long userId, RealAssetRequest.VehicleLinkRequest request) {
		String desc = "2022년식 · 32,000km | 번호: " + request.getCarNumber();

		TBRealAsset asset = TBRealAsset.builder()
			.user(userRepository.getReferenceById(userId))
			.assetNm("제네시스 G70")
			.evalAmt(new BigDecimal("46000000"))
			.assetCateCd(RealAssetCategory.VEHICLE) // 수정: AssetCategory -> RealAssetCategory
			.assetDesc(desc)
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
