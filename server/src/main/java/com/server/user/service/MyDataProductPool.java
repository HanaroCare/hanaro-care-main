package com.server.user.service;

import com.server.asset.entity.enums.AssetCategory;
import java.util.List;

public class MyDataProductPool {

  public record ProductTemplate(String instNm, String accountNm, AssetCategory category) {

  }

  public static final List<ProductTemplate> POOL_CASH = List.of(
      new ProductTemplate("하나은행", "하나 복리적금", AssetCategory.CASH),
      new ProductTemplate("하나은행", "하나 플러스 통장", AssetCategory.CASH),
      new ProductTemplate("하나은행", "하나 e-청약통장", AssetCategory.CASH),
      new ProductTemplate("국민은행", "KB 스타적금", AssetCategory.CASH),
      new ProductTemplate("신한은행", "신한 쏠편한 정기예금", AssetCategory.CASH)
  );

  public static final List<ProductTemplate> POOL_CARD = List.of(
      new ProductTemplate("하나카드", "하나 트래블로그 카드", AssetCategory.CARD),
      new ProductTemplate("하나카드", "하나 1Q 카드", AssetCategory.CARD),
      new ProductTemplate("삼성카드", "삼성 iD ON 카드", AssetCategory.CARD),
      new ProductTemplate("현대카드", "현대 M 카드", AssetCategory.CARD)
  );

  public static final List<ProductTemplate> POOL_STOCK = List.of(
      new ProductTemplate("하나증권", "하나 AI 성장 펀드", AssetCategory.STOCK),
      new ProductTemplate("하나증권", "하나 해외주식 계좌", AssetCategory.STOCK),
      new ProductTemplate("미래에셋증권", "미래에셋 배당주 펀드", AssetCategory.STOCK),
      new ProductTemplate("삼성증권", "테슬라 집중투자 계좌", AssetCategory.STOCK)
  );

  public static final List<ProductTemplate> POOL_INSURANCE = List.of(
      new ProductTemplate("하나생명", "하나 건강보험", AssetCategory.INSURANCE),
      new ProductTemplate("하나생명", "하나 암 전문 보험", AssetCategory.INSURANCE),
      new ProductTemplate("삼성생명", "삼성 종신보험", AssetCategory.INSURANCE),
      new ProductTemplate("메리츠화재", "메리츠 화재 종합보험", AssetCategory.INSURANCE)
  );

  public static final List<ProductTemplate> POOL_PENSION = List.of(
      new ProductTemplate("하나은행", "하나 IRP 계좌", AssetCategory.PENSION),
      new ProductTemplate("하나은행", "하나 연금저축", AssetCategory.PENSION),
      new ProductTemplate("미래에셋증권", "미래에셋 연금저축펀드", AssetCategory.PENSION),
      new ProductTemplate("KB국민은행", "KB 퇴직연금 IRP", AssetCategory.PENSION)
  );
}