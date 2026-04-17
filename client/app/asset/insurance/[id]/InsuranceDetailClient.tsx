'use client';

import Header from '@/components/navigation/Header';
import { InfoListCard } from '@/components/modules/InfoListCard';
import { formatKoreanCurrency } from '../../utils/formatCurrency';
import type { InsuranceAssetResponse } from '../../utils/types';

interface Props {
    assetData: InsuranceAssetResponse | null;
}

function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '정보 없음';
    return dateStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3');
}

export default function InsuranceDetailClient({ assetData }: Props) {
    if (!assetData) {
        return (
            <div className="flex min-h-screen flex-col bg-white">
                <Header title="보험 상세" />
                <div className="flex flex-1 items-center justify-center text-hana-black-400">
                    데이터를 불러올 수 없습니다.
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Header title="보험 상세" showBackButton={true} />

            <main className="flex flex-col items-center gap-6 px-6 py-6 pb-24">
                <div className="w-full">
                    <p className="text-[14px] text-hana-black-500">{assetData.instNm}</p>
                    <h2 className="mt-1 font-bold text-[24px] text-hana-black-900 leading-tight">
                        {assetData.assetNm}
                    </h2>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-[15px] text-hana-black-500">월 납입보험료</span>
                        <span className="font-bold text-[22px] text-hana-black-900 tracking-tight">
                            {formatKoreanCurrency(assetData.monthlyPremAmt)}
                        </span>
                    </div>
                </div>

                <InfoListCard
                    title="보험 정보"
                    items={[
                        { label: '보험사', value: assetData.instNm },
                        { label: '상품명', value: assetData.assetNm },
                        { label: '월 보험료', value: formatKoreanCurrency(assetData.monthlyPremAmt) },
                        { label: '만기일', value: formatDate(assetData.expireDt) },
                    ]}
                />
            </main>
        </div>
    );
}
