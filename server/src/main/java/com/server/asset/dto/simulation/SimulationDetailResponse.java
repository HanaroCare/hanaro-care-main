package com.server.asset.dto.simulation;

import java.io.Serializable;
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
public class SimulationDetailResponse implements Serializable {

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
    public static class IncomeDetails implements Serializable {
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
    public static class AgeSegment implements Serializable {
        private String range;
        private BigDecimal income;

        @JsonProperty("income_detail")
        private IncomeDetail incomeDetail;

        private BigDecimal expense;
        private AgeDetail detail;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IncomeDetail implements Serializable {
        private BigDecimal national;    // 국민연금
        private BigDecimal retirement;  // 퇴직연금 (구간별 점진 감소)
        private BigDecimal subsidy;     // 지자체 지원금
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AgeDetail implements Serializable {
        private BigDecimal living;
        private BigDecimal medical;
        private BigDecimal care;
    }
}
