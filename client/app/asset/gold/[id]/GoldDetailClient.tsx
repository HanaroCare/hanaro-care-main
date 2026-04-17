'use client';

import Header from '@/components/navigation/Header';
import { InfoListCard } from '@/components/modules/InfoListCard';
import { AssetChart } from '../../components/AssetChart';
import { AssetDetailLayout } from '../../components/AssetDetailLayout';
import { formatKoreanCurrency } from '../../utils/formatCurrency';
import type { AssetDetailResponse } from '@/app/asset/utils/types';

interface Props {
    assetData: AssetDetailResponse | null;
}

type GoldDesc = { purity?: string; weight_g?: string; price_per_gram?: string };

function safeJsonParse<T>(json: string | null | undefined): T {
    if (!json) return {} as T;
    try {
        return JSON.parse(json) as T;
    } catch {
        return {} as T;
    }
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

    const desc = safeJsonParse<GoldDesc>(assetData.assetDesc);
    const purity = desc.purity ?? '';
    const weightG = desc.weight_g ?? (assetData.assetSize ? String(assetData.assetSize) : '');
    const pricePerGram = desc.price_per_gram
        ? `${Number(desc.price_per_gram).toLocaleString('ko-KR')}원/g`
        : '118,500원/g';
    const itemNm = purity ? `금 현물 (${purity}K)` : assetData.assetNm;
    const weightLabel = weightG ? `${weightG}g` : '정보 없음';

    const goldInfo = {
        priceChange: 800000,
        changePercent: 6.4,
        location: '하나은행 역삼동지점',
    };

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Header title="금 상세" showBackButton={true} />

            <main className="flex flex-col items-center gap-6 px-6 py-6 pb-24">
                <div className="w-full">
                    <h2 className="font-bold text-[24px] text-hana-black-900 leading-tight">
                        {assetData.assetNm}
                    </h2>
                    <p className="mt-1 text-[15px] text-hana-black-500">
                        중량: {weightLabel}
                    </p>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="font-bold text-[28px] text-hana-black-900 tracking-tight">
                            {formatKoreanCurrency(assetData.amount)}
                        </span>
                        <span className="font-medium text-[15px] text-hana-red-500">
                            ▲ {formatKoreanCurrency(goldInfo.priceChange)} ({goldInfo.changePercent}%)
                        </span>
                    </div>
                </div>

                <AssetChart
                    title="국제 금 시세"
                    subtitle="최근 6개월 기준 (단위: 만원)"
                    data={[
                        { name: '11월', value: 1100 },
                        { name: '12월', value: 1250 },
                        { name: '1월', value: 1150 },
                        { name: '2월', value: 1300 },
                        { name: '3월', value: 1380 },
                        { name: '4월', value: assetData.amount / 10000 }, // 현재가를 만원 단위로 변환
                    ]}
                    config={{
                        type: 'line',
                        color: '#C1B483', // 금색 느낌의 차트 컬러
                        domain: [1000, 1500],
                        ticks: [1000, 1250, 1500],
                    }}
                />

                <InfoListCard
                    title="보유 정보"
                    items={[
                        { label: '품목명', value: itemNm },
                        { label: '보유량', value: weightLabel },
                        { label: '현재 시세', value: pricePerGram },
                        { label: '보관장소', value: goldInfo.location },
                    ]}
                />

                <InfoListCard
                    title="투자 수익 분석"
                    items={[
                        { label: '총 투자금', value: formatKoreanCurrency(assetData.amount - goldInfo.priceChange) },
                        { label: '평가 손익', value: `+${formatKoreanCurrency(goldInfo.priceChange)}` },
                        { label: '수익률', value: `${goldInfo.changePercent}%` },
                    ]}
                />

            </main>
        </div>
    );
}
