'use client';

import Header from '@/components/navigation/Header';
import { AssetDetailLayout } from '../../components/AssetDetailLayout';
import { formatKoreanCurrency } from '../../utils/formatCurrency';
import type { AssetDetailResponse } from '../../utils/types';

interface Props {
  assetData: AssetDetailResponse | null;
}

export default function HousingDetailClient({ assetData }: Props) {
  if (!assetData) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header title="부동산 상세" />
        <div className="flex flex-1 items-center justify-center text-hana-black-400">
          데이터를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  const acquisitionPrice = assetData.amount * 0.85;
  const publicPrice = assetData.amount * 0.72;

  return (
    <AssetDetailLayout
      headerTitle="부동산 상세"
      name={assetData.addr ?? assetData.assetNm}
      subtitle={`${assetData.assetNm} · ${assetData.assetSize}㎡`}
      amount={assetData.amount}
      priceChange={12000000}
      changePercent={1.3}
      chart={{
        title: '부동산 시세 변화',
        data: [
          { name: '11월', value: 8.8 },
          { name: '12월', value: 8.9 },
          { name: '1월', value: 9.0 },
          { name: '2월', value: 9.1 },
          { name: '3월', value: 9.2 },
          { name: '4월', value: assetData.amount / 100000000 },
        ],
        config: {
          type: 'line',
          color: '#008485',
          domain: [8.5, 9.5],
          ticks: [8.5, 9.0, 9.5],
        },
      }}
      sections={[
        {
          title: '취득 및 공시 정보',
          items: [
            { label: '취득일', value: '2021.03.15' },
            { label: '취득가', value: formatKoreanCurrency(acquisitionPrice) },
            { label: '현재 시세', value: formatKoreanCurrency(assetData.amount) },
            { label: '공시지가', value: formatKoreanCurrency(publicPrice) },
          ],
        },
        {
          title: '담보 대출 정보 (하나은행)',
          items: [
            { label: '대출 잔액', value: '2억 1,000만원' },
            { label: '월 상환금', value: '98만원' },
            { label: '적용 금리', value: '연 3.85%' },
            { label: '만기', value: '2041.03' },
          ],
        },
        {
          title: '세금 예상',
          items: [
            { label: '재산세', value: '약 180만원/년' },
            { label: '양도세 (매각 시)', value: '약 4,500만원' },
          ],
        },
      ]}
    />
  );
}