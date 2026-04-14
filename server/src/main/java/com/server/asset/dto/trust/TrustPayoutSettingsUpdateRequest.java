package com.server.asset.dto.trust;

import com.server.asset.entity.enums.TrustType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

@Schema(description = "신탁 자금 사용처 수정 요청")
public record TrustPayoutSettingsUpdateRequest(
	@NotNull
	@Schema(description = "집행 항목 리스트")
	List<PayoutItemDto> items
) {
	@Schema(description = "집행 항목")
	public record PayoutItemDto(
		@NotNull
		@Schema(description = "집행 유형", example = "HOSPITAL", allowableValues = {"HOSPITAL", "LIVING"})
		TrustType type,

		@NotNull
		@Schema(description = "월 집행 금액", example = "500000")
		BigDecimal amount
	) {}
}
