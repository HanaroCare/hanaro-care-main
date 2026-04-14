package com.server.asset.mapper;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.asset.dto.trust.TrustProductResponse;
import com.server.asset.dto.trust.TrustSimulationResultResponse.SimulationDetailDto;
import com.server.asset.dto.trust.TrustSimulationSaveRequest;
import com.server.asset.entity.TBProduct;
import com.server.asset.entity.TBTrustSimulation;
import com.server.asset.entity.TBUserProd;
import com.server.asset.entity.enums.ProdStat;
import com.server.asset.entity.enums.ProdType;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import com.server.user.entity.TBUser;

import java.math.BigDecimal;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", imports = {ProdType.class, ProdStat.class})
public abstract class TrustMapper {

  @Autowired
  protected ObjectMapper objectMapper;

  // ── 시뮬레이션 조건 저장/수정 ──────────────────────────────────────
  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL)
  @Mapping(target = "trustSimulationId", ignore = true)
  @Mapping(target = "user", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "payoutSettings", expression = "java(toJson(request.payoutSettings()))")
  @Mapping(target = "claimAgent", source = "claimAgent")
  @Mapping(target = "principalAmount", source = "request.principalAmount")
  @Mapping(target = "startType", source = "request.startType")
  @Mapping(target = "startDate", source = "request.startDate")
  @Mapping(target = "investType", source = "request.investType")
  @Mapping(target = "payoutType", source = "request.payoutType")
  public abstract void updateSimulation(
      TrustSimulationSaveRequest request,
      TBUser claimAgent,
      @MappingTarget TBTrustSimulation simulation
  );

  // ── 신탁 상품 가입 시 TBUserProd 생성 ──────────────────────────────
  @Mapping(target = "userProdId", ignore = true)
  @Mapping(target = "user", source = "user")
  @Mapping(target = "product", source = "product")
  @Mapping(target = "prodType", expression = "java(ProdType.TRUST)")
  @Mapping(target = "prodStat", expression = "java(ProdStat.IN_PROGRESS)")
  @Mapping(target = "payoutType", source = "simulation.payoutType")
  @Mapping(target = "investType", source = "simulation.investType")
  @Mapping(target = "principalAmount", source = "principal")
  @Mapping(target = "profitRate", source = "detail.profitRate")
  @Mapping(target = "profit", expression = "java(detail.expectedNetAmount().subtract(principal))")
  @Mapping(target = "startType", source = "simulation.startType")
  @Mapping(target = "startDate", source = "simulation.startDate")
  @Mapping(target = "claimAgent", source = "simulation.claimAgent")
  @Mapping(target = "payoutSettings", source = "simulation.payoutSettings")
  @Mapping(target = "targetAsset", ignore = true)
  @Mapping(target = "monthlyPayout", ignore = true)
  @Mapping(target = "period", ignore = true)
  @Mapping(target = "isAgentView", ignore = true)
  public abstract TBUserProd toUserProd(
      TBTrustSimulation simulation,
      TBUser user,
      TBProduct product,
      BigDecimal principal,
      SimulationDetailDto detail
  );

  // ── 운용현황 응답 생성 ─────────────────────────────────────────────
  @Mapping(target = "userProdId", source = "userProd.userProdId")
  @Mapping(target = "productName", source = "userProd.product.prodNm")
  @Mapping(target = "prodStatus", expression = "java(userProd.getProdStat().name())")
  @Mapping(target = "currentAmount", source = "currentAmount")
  @Mapping(target = "profitRate", source = "profitRate")
  @Mapping(target = "principalAmount", source = "principalAmount")
  @Mapping(target = "executionAmount", source = "executionAmount")
  @Mapping(target = "profit", source = "profit")
  @Mapping(target = "executionSetting", source = "executionSetting")
  public abstract TrustProductResponse toProductResponse(
      TBUserProd userProd,
      BigDecimal currentAmount,
      BigDecimal profitRate,
      BigDecimal principalAmount,
      BigDecimal executionAmount,
      BigDecimal profit,
      TrustProductResponse.ExecutionSetting executionSetting
  );

  protected String toJson(Object obj) {
    if (obj == null) return null;
    try {
      return objectMapper.writeValueAsString(obj);
    } catch (Exception e) {
      throw new ApiException(ErrorStatus.TRUST_JSON_PROCESSING_ERROR);
    }
  }
}
