package com.server.asset.service;

import java.math.BigDecimal;
import java.util.HashMap;
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
	private final ObjectMapper objectMapper;

	public Long linkHousing(Long userId, RealAssetRequest.HousingLinkRequest request) {
		Map<String, Object> extraInfo = Map.of(
			"housing_type", request.getHousingType(),
			"acquisition_year", request.getAcquisitionYear(),
			"has_loan", request.getHasLoan()
		);

		TBRealAsset asset = TBRealAsset.builder()
			.user(userRepository.getReferenceById(userId))
			.assetNm("하나아파트")
			.addr(request.getAddr())
			.assetSize(BigDecimal.valueOf(request.getAssetSize()))
			.evalAmt(new BigDecimal("920000000"))
			.assetCateCd(RealAssetCategory.REAL_ESTATE)
			.assetDesc(toJson(extraInfo))
			.build();

		return realAssetRepository.save(asset).getRealAssetId();
	}

	public Long linkVehicle(Long userId, RealAssetRequest.VehicleLinkRequest request) {
		Map<String, String> vehicleInfo = new HashMap<>();
		vehicleInfo.put("car_number", request.getCarNumber());
		vehicleInfo.put("model", "제네시스 G70");
		vehicleInfo.put("details", "2022년식 · 32,000km");

		TBRealAsset asset = TBRealAsset.builder()
			.user(userRepository.getReferenceById(userId))
			.assetNm("제네시스 G70")
			.evalAmt(new BigDecimal("46000000"))
			.assetCateCd(RealAssetCategory.VEHICLE)
			.assetDesc(toJson(vehicleInfo)) // 여기서 예외 발생 시 로직 중단
			.build();

		return realAssetRepository.save(asset).getRealAssetId();
	}

	public Long linkGold(Long userId, RealAssetRequest.GoldLinkRequest request) {
		BigDecimal goldPricePerGram = new BigDecimal("138000");
		BigDecimal evalAmt = goldPricePerGram.multiply(BigDecimal.valueOf(request.getAssetSize()));

		Map<String, String> goldInfo = Map.of("purity", request.getPurity());

		TBRealAsset asset = TBRealAsset.builder()
			.user(userRepository.getReferenceById(userId))
			.assetNm("금 현물 (" + request.getPurity() + ")")
			.assetSize(BigDecimal.valueOf(request.getAssetSize()))
			.evalAmt(evalAmt)
			.assetCateCd(RealAssetCategory.GOLD)
			.assetDesc(toJson(goldInfo))
			.build();

		return realAssetRepository.save(asset).getRealAssetId();
	}

	public void unlinkRealAsset(Long userId, Long realAssetId) {
		TBRealAsset asset = realAssetRepository.findByRealAssetIdAndUser_UserId(realAssetId, userId)
			.orElseThrow(() -> new ApiException(ErrorStatus.ASSET_NOT_FOUND));

		realAssetRepository.delete(asset);
	}

	private String toJson(Object obj) {
		try {
			return objectMapper.writeValueAsString(obj);
		} catch (JsonProcessingException e) {
			log.error("[RealAssetService] JSON 직렬화 오류: {}", e.getMessage());
			throw new ApiException(ErrorStatus.SIMULATION_JSON_ERROR);
		}
	}
}
