package com.server.asset.dto.response;

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
public class SimulationDetailResponse {

    @JsonProperty("income_details")
    private IncomeDetails incomeDetails;

    @JsonProperty("age_segments")
    private List<AgeSegment> ageSegments;

    @JsonProperty("ai_opinion")
    private String aiOpinion;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IncomeDetails {
        @JsonProperty("national_pension")
        private BigDecimal nationalPension;

        @JsonProperty("retirement_pension")
        private BigDecimal retirementPension;

        @JsonProperty("local_subsidy_amt")
        private BigDecimal localSubsidyAmt;

        @JsonProperty("local_subsidy_name")
        private String localSubsidyName;

        @JsonProperty("total_monthly_income")
        private BigDecimal totalMonthlyIncome;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AgeSegment {
        private String range;
        private BigDecimal income;
        private BigDecimal expense;
        private AgeDetail detail;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AgeDetail {
        private BigDecimal living;
        private BigDecimal medical;
        private BigDecimal care;
    }
}
