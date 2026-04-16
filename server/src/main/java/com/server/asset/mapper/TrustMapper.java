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

  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL)
  @Mapping(target = "trustSimulationId", ignore = true)
  @Mapping(target = "user", ignore = true)
  @Mapping(target = "payoutSettings", expression = "java(toJson(request.payoutSettings()))")
  @Mapping(target = "claimAgent", source = "claimAgent")
  public abstract void updateSimulation(
      TrustSimulationSaveRequest request,
      TBUser claimAgent,
      @MappingTarget TBTrustSimulation simulation
  );

  @Mapping(target = "userProdId", ignore = true)
  @Mapping(target = "user", source = "user")
  @Mapping(target = "product", source = "product")
  @Mapping(target = "prodType", expression = "java(ProdType.TRUST)")
  @Mapping(target = "prodStat", expression = "java(ProdStat.IN_PROGRESS)")
  @Mapping(target = "payoutType", source = "simulation.payoutType")
  @Mapping(target = "investType", source = "simulation.investType")
  @Mapping(target = "principalAmount", source = "principal")
  @Mapping(target = "profitRate", source = "detail.profitRate")
  @Mapping(
            target = "profit",
            expression = "java((detail != null && detail.expectedNetAmount() != null && principal != null) ? detail.expectedNetAmount().subtract(principal) : null)"
        )
  @Mapping(target = "startType", source = "simulation.startType")
  @Mapping(target = "startDate", source = "simulation.startDate")
  @Mapping(target = "claimAgent", source = "simulation.claimAgent")
  @Mapping(target = "payoutSettings", source = "simulation.payoutSettings")
  @Mapping(target = "isAgentView", constant = "false")
  public abstract TBUserProd toUserProd(
      TBTrustSimulation simulation,
      TBUser user,
      TBProduct product,
      BigDecimal principal,
      SimulationDetailDto detail
  );

  @Mapping(target = "userProdId", source = "userProd.userProdId")
  @Mapping(target = "productName", source = "userProd.product.prodNm")
  @Mapping(target = "prodStatus", expression = "java(userProd.getProdStat().name())")
  @Mapping(target = "currentAmount", source = "currentAmount")
  @Mapping(target = "profitRate", source = "profitRate")
  @Mapping(target = "principalAmount", source = "principalAmount")
  @Mapping(target = "executionAmount", source = "executionAmount")
  @Mapping(target = "profit", source = "profit")
  @Mapping(target = "executionSetting", source = "executionSetting")
  @Mapping(target = "claimAgent", source = "claimAgent")
  @Mapping(target = "agentViewEnabled", source = "agentViewEnabled")
  public abstract TrustProductResponse toProductResponse(
      TBUserProd userProd,
      BigDecimal currentAmount,
      BigDecimal profitRate,
      BigDecimal principalAmount,
      BigDecimal executionAmount,
      BigDecimal profit,
      TrustProductResponse.ExecutionSetting executionSetting,
      TrustProductResponse.ClaimAgent claimAgent,
      Boolean agentViewEnabled
  );

  // JSON 변환 헬퍼 메서드
  protected String toJson(Object obj) {
    if (obj == null) return null;
    try {
      return objectMapper.writeValueAsString(obj);
    } catch (Exception e) {
      throw new ApiException(ErrorStatus.TRUST_JSON_PROCESSING_ERROR);
    }
  }
}
