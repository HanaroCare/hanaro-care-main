package com.server.simulation.dto.response;

import java.math.BigDecimal;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimulationSummaryResponse {
    private Boolean isSufficient;
    private BigDecimal shortageAmt;
    private BigDecimal livingCost;
    private BigDecimal medicalCost;
    private BigDecimal careCost;

    @JsonProperty("age_segments")
    private List<SimulationDetailResponse.AgeSegment> ageSegments;

    @JsonProperty("ai_opinion")
    private String aiOpinion;
}
