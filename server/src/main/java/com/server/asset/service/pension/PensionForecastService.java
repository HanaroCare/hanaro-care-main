package com.server.asset.service.pension;

import com.server.asset.dto.pension.PensionForecastInternalDto;
import com.server.asset.dto.pension.PensionForecastResponse;
import com.server.asset.entity.TBRealAsset;
import com.server.asset.entity.enums.RealAssetCategory;
import com.server.asset.mapper.PensionMapper;
import com.server.asset.repository.RealAssetRepository;
import com.server.common.annotation.CheckUser;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PensionForecastService {

	private final RealAssetRepository realAssetRepository;
	private final PensionPricePredictor pensionPricePredictor;
	private final PensionMapper pensionMapper;

	@CheckUser(key = "#userId")
	public PensionForecastResponse getForecast(Long userId, Long realAssetId, Integer periodYears) {
		validatePeriodYears(periodYears);

		TBRealAsset asset = findOwnedAsset(userId, realAssetId);
		validateForecastable(asset);

		PensionForecastInternalDto.Command command = PensionForecastInternalDto.Command.builder()
			.addr(asset.getAddr())
			.currentPrice(asset.getEvalAmt())
			.assetSize(asset.getAssetSize())
			.periodYears(periodYears)
			.build();

		PensionForecastInternalDto.Result result = pensionPricePredictor.predict(command);
		return pensionMapper.toForecastResponse(asset, result);
	}

	private TBRealAsset findOwnedAsset(Long userId, Long realAssetId) {
		TBRealAsset asset = realAssetRepository.findByRealAssetId(realAssetId)
			.orElseThrow(() -> new ApiException(ErrorStatus.PENSION_ASSET_NOT_FOUND));

		if (!asset.getUser().getUserId().equals(userId)) {
			throw new ApiException(ErrorStatus._FORBIDDEN);
		}
		return asset;
	}

	private void validateForecastable(TBRealAsset asset) {
		if (asset.getAssetCateCd() != RealAssetCategory.REAL_ESTATE) {
			throw new ApiException(ErrorStatus.PENSION_NOT_REAL_ESTATE);
		}
		if (asset.getEvalAmt() == null || asset.getEvalAmt().compareTo(BigDecimal.ZERO) <= 0) {
			throw new ApiException(ErrorStatus.PENSION_NO_EVAL_AMT);
		}
	}

	private void validatePeriodYears(Integer periodYears) {
		if (periodYears == null || (periodYears != 5 && periodYears != 10 && periodYears != 20)) {
			throw new ApiException(ErrorStatus.PENSION_INVALID_PERIOD);
		}
	}
}
