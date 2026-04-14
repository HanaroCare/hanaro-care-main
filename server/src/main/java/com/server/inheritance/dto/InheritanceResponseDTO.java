package com.server.inheritance.dto;

import com.server.user.enums.FamilyRelation;
import java.math.BigDecimal;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InheritanceResponseDTO {
    private Long planId;
    private BigDecimal totalInheritAmt;
    private BigDecimal estiTaxAmt;
    private List<HeirSummaryDTO> heirs;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HeirSummaryDTO {
        private Long inheritDetailId;
        private Long heirUserId;
        private String heirName;
        private FamilyRelation relation;
        private Double distRatio;
        private BigDecimal distributedAmt;
        private Boolean hasLetter;
        private Long letterId;
    }
}
