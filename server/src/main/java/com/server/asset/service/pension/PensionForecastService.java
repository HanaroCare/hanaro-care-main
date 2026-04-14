package com.server.asset.service.pension;

import com.server.asset.dto.pension.PensionForecastChartPointDto;
import com.server.asset.dto.pension.PensionForecastInternalDto;
import com.server.asset.dto.pension.PensionForecastResponse;
import com.server.asset.dto.pension.PensionForecastScenarioDto;
import com.server.asset.entity.TBRealAsset;
import com.server.asset.entity.enums.RealAssetCategory;
import com.server.asset.repository.TBRealAssetRepository;
import com.server.common.annotation.CheckUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PensionForecastService {

	private final TBRealAssetRepository realAssetRepository;
	private final PensionPricePredictor pensionPricePredictor;

	@CheckUser
	public PensionForecastResponse getForecast(Long realAssetId, Integer periodYears) {
		validatePeriodYears(periodYears);

		TBRealAsset asset = realAssetRepository.findByRealAssetId(realAssetId)
			.orElseThrow(() -> new IllegalArgumentException("해당 주택 자산이 없습니다."));

		validateForecastable(asset);

		PensionForecastInternalDto.Command command = PensionForecastInternalDto.Command.builder()
			.addr(asset.getAddr())
			.currentPrice(asset.getEvalAmt())
			.assetSize(asset.getAssetSize())
			.periodYears(periodYears)
			.build();

		PensionForecastInternalDto.Result result = pensionPricePredictor.predict(command);

		return PensionForecastResponse.builder()
			.realAssetId(asset.getRealAssetId())
			.assetNm(asset.getAssetNm())
			.currentPrice(asset.getEvalAmt())
			.periodYears(result.getPeriodYears())
			.scenarios(toScenarioDtos(result.getScenarios()))
			.chartPoints(toChartPointDtos(result.getChartPoints()))
			.recommendedScenario(result.getRecommendedScenario())
			.recommendedTitle(result.getRecommendedTitle())
			.recommendedDescription(result.getRecommendedDescription())
			.modelVersion(result.getModelVersion())
			.predictedAt(result.getPredictedAt())
			.build();
	}

	private void validateForecastable(TBRealAsset asset) {
		if (asset.getAssetCateCd() != RealAssetCategory.REAL_ESTATE) {
			throw new IllegalArgumentException("부동산 자산만 예측할 수 있습니다.");
		}

		if (asset.getEvalAmt() == null || asset.getEvalAmt().compareTo(BigDecimal.ZERO) <= 0) {
			throw new IllegalArgumentException("현재 평가금액이 없어 예측할 수 없습니다.");
		}
	}

	private void validatePeriodYears(Integer periodYears) {
		if (periodYears == null || (periodYears != 5 && periodYears != 10 && periodYears != 20)) {
			throw new IllegalArgumentException("조회 기간은 5년, 10년, 20년만 가능합니다.");
		}
	}

	private List<PensionForecastScenarioDto> toScenarioDtos(List<PensionForecastInternalDto.Scenario> scenarios) {
		return scenarios.stream()
			.map(s -> PensionForecastScenarioDto.builder()
				.scenarioType(s.getScenarioType())
				.annualRate(s.getAnnualRate())
				.predictedPrice(s.getPredictedPrice())
				.probability(s.getProbability())
				.build())
			.toList();
	}

	private List<PensionForecastChartPointDto> toChartPointDtos(List<PensionForecastInternalDto.ChartPoint> chartPoints) {
		return chartPoints.stream()
			.map(p -> PensionForecastChartPointDto.builder()
				.year(p.getYear())
				.downPrice(p.getDownPrice())
				.basePrice(p.getBasePrice())
				.upPrice(p.getUpPrice())
				.build())
			.toList();
	}
}
