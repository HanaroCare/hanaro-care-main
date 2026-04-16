package com.server.inheritance.dto;

import com.server.user.enums.FamilyRelation;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InheritanceRequestDTO {
    private List<HeirDistributionDTO> distributions;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HeirDistributionDTO {
        private Long heirUserId;
        private String heirName;
        private FamilyRelation relation;
        private Double distRatio;
    }
}
