package com.server.asset.service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.asset.dto.link.RealAssetLinkResponse;
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

  // 금 1g 당 현재 시세 (원)
  private static final BigDecimal GOLD_PRICE_PER_GRAM = new BigDecimal("118500");

  private final RealAssetRepository realAssetRepository;
  private final UserRepository userRepository;
  private final ObjectMapper objectMapper;

  // 주택
  private static HousingProfile matchHousing(String addr) {
    if (addr != null && addr.contains("연남")) {
      return new HousingProfile("연남동 다가구주택", new BigDecimal("1850000000"));
    }
    if (addr != null && addr.contains("반포")) {
      return new HousingProfile("반포 래미안 아파트", new BigDecimal("2950000000"));
    }
    return new HousingProfile("하나아파트", new BigDecimal("920000000"));
  }

  private record HousingProfile(String assetNm, BigDecimal evalAmt) {

  }

  // 차량
  private static VehicleProfile matchVehicle(String carNumber) {
    if (carNumber != null && carNumber.contains("3456")) {
      return new VehicleProfile(
          "제네시스 G90", "제네시스", "G90",
          new BigDecimal("138000000"), "2023.03.15", "12,000km");
    }
    if (carNumber != null && carNumber.contains("8888")) {
      return new VehicleProfile(
          "BMW X7", "BMW", "X7",
          new BigDecimal("152000000"), "2022.07.22", "28,000km");
    }
    return new VehicleProfile(
        "제네시스 G70", "제네시스", "G70",
        new BigDecimal("46000000"), "2021.02.21", "32,000km");
  }

  private record VehicleProfile(
      String assetNm, String brand, String model,
      BigDecimal evalAmt, String registrationDt, String mileage
  ) {

  }


  public RealAssetLinkResponse linkHousing(Long userId,
      RealAssetRequest.HousingLinkRequest request, boolean hanaCertYn) {

    HousingProfile profile = matchHousing(request.getAddr());

    if (hanaCertYn) {
      log.info("[RealAsset] 하나인증서 인증 정보 기반 자동 매칭 완료 — housing userId={} assetNm={}",
          userId, profile.assetNm());
    }

    Map<String, Object> extraInfo = new HashMap<>();
    extraInfo.put("housing_type", request.getHousingType());
    extraInfo.put("acquisition_year", request.getAcquisitionYear());
    extraInfo.put("has_loan", request.getHasLoan());

    TBRealAsset asset = TBRealAsset.builder()
        .user(userRepository.getReferenceById(userId))
        .assetNm(profile.assetNm())
        .addr(request.getAddr())
        .assetSize(request.getAssetSize())
        .evalAmt(profile.evalAmt())
        .assetCateCd(RealAssetCategory.REAL_ESTATE)
        .assetDesc(toJson(extraInfo))
        .build();

    Long savedId = realAssetRepository.save(asset).getRealAssetId();
    log.info("[RealAsset] 부동산 저장 완료 userId={} realAssetId={} evalAmt={}",
        userId, savedId, profile.evalAmt());

    return RealAssetLinkResponse.builder()
        .realAssetId(String.valueOf(savedId))
        .assetNm(profile.assetNm())
        .evalAmt(profile.evalAmt())
        .build();
  }

  public RealAssetLinkResponse linkVehicle(Long userId,
      RealAssetRequest.VehicleLinkRequest request, boolean hanaCertYn) {

    VehicleProfile profile = matchVehicle(request.getCarNumber());

    if (hanaCertYn) {
      log.info("[RealAsset] 하나인증서 인증 정보 기반 자동 매칭 완료 — vehicle userId={} model={}",
          userId, profile.model());
    }

    Map<String, String> vehicleInfo = new HashMap<>();
    vehicleInfo.put("car_number", request.getCarNumber());
    vehicleInfo.put("brand", profile.brand());
    vehicleInfo.put("model", profile.model());
    vehicleInfo.put("details", profile.registrationDt() + " · " + profile.mileage());

    TBRealAsset asset = TBRealAsset.builder()
        .user(userRepository.getReferenceById(userId))
        .assetNm(profile.assetNm())
        .evalAmt(profile.evalAmt())
        .assetCateCd(RealAssetCategory.VEHICLE)
        .assetDesc(toJson(vehicleInfo))
        .build();

    Long savedId = realAssetRepository.save(asset).getRealAssetId();
    log.info("[RealAsset] 차량 저장 완료 userId={} realAssetId={} assetNm={}",
        userId, savedId, profile.assetNm());

    return RealAssetLinkResponse.builder()
        .realAssetId(String.valueOf(savedId))
        .assetNm(profile.assetNm())
        .evalAmt(profile.evalAmt())
        .brand(profile.brand())
        .model(profile.model())
        .registrationDt(profile.registrationDt())
        .build();
  }

  public RealAssetLinkResponse linkGold(Long userId,
      RealAssetRequest.GoldLinkRequest request, boolean hanaCertYn) {

    BigDecimal weight = request.getAssetSize();
    BigDecimal evalAmt = GOLD_PRICE_PER_GRAM.multiply(weight);

    if (hanaCertYn) {
      log.info("[RealAsset] 하나인증서 인증 정보 기반 자동 매칭 완료 — gold userId={} weight={}g",
          userId, weight);
    }

    Map<String, String> goldInfo = new HashMap<>();
    goldInfo.put("purity", request.getPurity());
    goldInfo.put("weight_g", weight.toPlainString());
    goldInfo.put("price_per_gram", GOLD_PRICE_PER_GRAM.toPlainString());

    String assetNm = "금 현물 (" + request.getPurity() + "K)";

    TBRealAsset asset = TBRealAsset.builder()
        .user(userRepository.getReferenceById(userId))
        .assetNm(assetNm)
        .assetSize(weight)
        .evalAmt(evalAmt)
        .assetCateCd(RealAssetCategory.GOLD)
        .assetDesc(toJson(goldInfo))
        .build();

    Long savedId = realAssetRepository.save(asset).getRealAssetId();
    log.info("[RealAsset] 금 저장 완료 userId={} realAssetId={} evalAmt={}",
        userId, savedId, evalAmt);

    return RealAssetLinkResponse.builder()
        .realAssetId(String.valueOf(savedId))
        .assetNm(assetNm)
        .evalAmt(evalAmt)
        .build();
  }
  
  public void unlinkRealAsset(Long userId, Long realAssetId) {
    TBRealAsset asset = realAssetRepository
        .findByRealAssetIdAndUser_UserId(realAssetId, userId)
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
