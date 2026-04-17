package com.server.asset.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AssetChartPointDTO {
    private String month;
    private double value; // 억 단위 (소수점 1자리)
}
