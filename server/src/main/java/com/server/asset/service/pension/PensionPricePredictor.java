package com.server.asset.service.pension;

import com.server.asset.dto.pension.PensionForecastInternalDto;

public interface PensionPricePredictor {
	PensionForecastInternalDto.Result predict(PensionForecastInternalDto.Command command);
}
