'use client';

import Header from '@/components/navigation/Header';
import { AssetDetailLayout } from '../../components/AssetDetailLayout';
import { formatKoreanCurrency } from '../../utils/formatCurrency';
import type { AssetDetailResponse } from '@/app/asset/utils/types';

interface Props {
  assetData: AssetDetailResponse | null;
}

export default function GoldDetailClient({ assetData }: Props) {
  if (!assetData) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header title="금 상세" />
        <div className="flex flex-1 items-center justify-center text-hana-black-400">
          데이터를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  const weight = assetData.assetSize ? `${assetData.assetSize}g` : '100g';
  const priceChange = 800000;
  const changePercent = 6.4;

  return (
    <AssetDetailLayout
      headerTitle="금 상세"
      name={assetData.assetNm}
      subtitle={`중량: ${weight}`}
      amount={assetData.amount}
      priceChange={priceChange}
      changePercent={changePercent}
      chart={{
        title: '국제 금 시세',
        subtitle: '최근 6개월 기준 (단위: 만원)',
        data: [
          { name: '11월', value: 1100 },
          { name: '12월', value: 1250 },
          { name: '1월', value: 1150 },
          { name: '2월', value: 1300 },
          { name: '3월', value: 1380 },
          { name: '4월', value: assetData.amount / 10000 },
        ],
        config: {
          type: 'line',
          color: '#C1B483',
          domain: [1000, 1500],
          ticks: [1000, 1250, 1500],
        },
      }}
      sections={[
        {
          title: '보유 정보',
          items: [
            { label: '품목명', value: assetData.assetNm },
            { label: '보유량', value: weight },
            { label: '평균단가', value: '12.5만원/g' },
            { label: '보관장소', value: '하나은행 역삼동지점' },
          ],
        },
        {
          title: '투자 수익 분석',
          items: [
            {
              label: '총 투자금',
              value: formatKoreanCurrency(assetData.amount - priceChange),
            },
            { label: '평가 손익', value: `+${formatKoreanCurrency(priceChange)}` },
            { label: '수익률', value: `${changePercent}%` },
          ],
        },
      ]}
      footer={
        <div className="w-full px-2">
          <p className="text-[12px] text-hana-black-400 leading-normal">
            *{' '}
            {assetData.assetDesc ||
              '하나은행 금 현물 계좌를 통해 안전하게 보관 중입니다.'}
          </p>
        </div>
      }
    />
  );
}