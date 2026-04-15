'use client';

import Header from '@/components/navigation/Header';
import { InfoListCard } from '@/components/modules/InfoListCard';
import { AssetChart } from '../../components/AssetChart';
import { formatKoreanCurrency } from '../../utils/formatCurrency';
import type {AssetDetailResponse} from '../../utils/types';

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

    // 가라(Mock) 데이터 생성
    const detailInfo = {
        change: 12000000,
        changePercent: 1.3,
        acquisitionDate: '2021.03.15',
        acquisitionPrice: assetData.amount * 0.85,
        publicPrice: assetData.amount * 0.72,
    };

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Header title="부동산 상세" showBackButton={true} />

            <main className="flex flex-col items-center gap-6 px-6 py-6 pb-24">
                <div className="w-full">
                    <h2 className="font-bold text-[24px] text-hana-black-900 leading-tight">
                        {assetData.addr}
                    </h2>
                    <p className="mt-1 text-[15px] text-hana-black-500">
                        {assetData.assetNm} · {assetData.assetSize}㎡
                    </p>
                    <div className="mt-4 flex items-baseline gap-2">
            <span className="font-bold text-[28px] text-hana-black-900 tracking-tight">
              {formatKoreanCurrency(assetData.amount)}
            </span>
                        <span className="font-medium text-[15px] text-hana-red-500">
              ▲ {formatKoreanCurrency(detailInfo.change)} ({detailInfo.changePercent}%)
            </span>
                    </div>
                </div>

                <AssetChart
                    title="부동산 시세 변화"
                    data={[
                        { name: '11월', value: 8.8 },
                        { name: '12월', value: 8.9 },
                        { name: '1월', value: 9.0 },
                        { name: '2월', value: 9.1 },
                        { name: '3월', value: 9.2 },
                        { name: '4월', value: assetData.amount / 100000000 },
                    ]}
                    config={{
                        type: 'line',
                        color: '#008485',
                        domain: [8.5, 9.5],
                        ticks: [8.5, 9.0, 9.5],
                    }}
                />

                <InfoListCard
                    title="취득 및 공시 정보"
                    items={[
                        { label: '취득일', value: detailInfo.acquisitionDate },
                        { label: '취득가', value: formatKoreanCurrency(detailInfo.acquisitionPrice) },
                        { label: '현재 시세', value: formatKoreanCurrency(assetData.amount) },
                        { label: '공시지가', value: formatKoreanCurrency(detailInfo.publicPrice) },
                    ]}
                />

                <InfoListCard
                    title="담보 대출 정보 (하나은행)"
                    items={[
                        { label: '대출 잔액', value: '2억 1,000만원' },
                        { label: '월 상환금', value: '98만원' },
                        { label: '적용 금리', value: '연 3.85%' },
                        { label: '만기', value: '2041.03' },
                    ]}
                />

                <InfoListCard
                    title="세금 예상"
                    items={[
                        { label: '재산세', value: '약 180만원/년' },
                        { label: '양도세 (매각 시)', value: '약 4,500만원' },
                    ]}
                />
            </main>
        </div>
    );
}
