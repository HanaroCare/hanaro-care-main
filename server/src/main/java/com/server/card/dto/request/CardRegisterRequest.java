package com.server.card.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.math.BigDecimal;
import java.util.List;
import lombok.Getter;

@Getter
public class CardRegisterRequest {

  @NotNull
  @Schema(description = "연동 계좌 ID", example = "2001")
  private String accountId;

  @NotBlank
  @Schema(description = "카드 이름", example = "김복순 요양사의 카드")
  private String cardNm;

  @NotNull
  @DecimalMax("2000000")
  @Schema(description = "자동이체 목표 잔액 (최대 200만원)", example = "400000")
  private BigDecimal limitAmt;

  @Schema(description = "자동이체 금액", example = "400000")
  private BigDecimal autoTransAmt;

  @NotBlank
  @Pattern(regexp = "^[A-E]$", message = "디자인 코드는 A~E 중 하나여야 합니다.")
  @Schema(description = "카드 디자인 코드 (A~E)", example = "A")
  private String designCd;

  @Schema(description = "카드 공유할 가족 권한 ID 목록", example = "[1, 2]")
  private List<String> familyAuthIds;

  @NotNull
  @Min(1)
  @Max(28)
  @Schema(description = "자동이체일 (1~28일)", example = "15")
  private Integer payDay;
}
