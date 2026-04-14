package com.server.simulation.dto.response;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimulationResponse {

    @JsonProperty("simulation_id")
    private Long simulationId;

    private SimulationSummary summary;

    @JsonProperty("current_spending")
    private CurrentSpending currentSpending;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SimulationSummary {
        @JsonProperty("is_sufficient")
        private Boolean isSufficient;

        @JsonProperty("monthly_shortage_amt")
        private BigDecimal monthlyShortageAmt;

        @JsonProperty("total_income_amt")
        private BigDecimal totalIncomeAmt;

        @JsonProperty("total_monthly_cost")
        private BigDecimal totalMonthlyCost;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CurrentSpending {
        private BigDecimal living;
        private BigDecimal medical;
        private BigDecimal care;
    }
}
