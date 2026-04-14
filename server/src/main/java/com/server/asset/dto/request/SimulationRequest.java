package com.server.asset.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.server.asset.entity.enums.CareType;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimulationRequest {

    @Schema(description = "준비할 나이", example = "85")
    @JsonProperty("target_age")
    private Integer targetAge;

    @Schema(description = "요양방식 (HOME, CENTER, HOSPITAL)", example = "CENTER")
    @JsonProperty("care_type")
    private CareType careType;
}
