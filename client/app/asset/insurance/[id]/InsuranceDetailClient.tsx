'use client';

import Header from '@/components/navigation/Header';
import { InfoListCard } from '@/components/modules/InfoListCard';
import { formatKoreanCurrency } from '../../utils/formatCurrency';
import { InsuranceDetailDto } from '@/app/my/insurance/types';

interface Props {
    assetData: InsuranceDetailDto | null;
}

function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '정보 없음';
    const cleaned = dateStr.replace(/-/g, '');
    if (cleaned.length === 8) {
        return cleaned.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3');
    }
    return dateStr;
}

export default function InsuranceDetailClient({ assetData }: Props) {
    if (!assetData || !assetData.insuranceDto) {
        return (
            <div className="flex min-h-screen flex-col bg-white">
                <Header title="보험 상세" />
                <div className="flex flex-1 items-center justify-center text-hana-black-400">
                    데이터를 불러올 수 없습니다.
                </div>
            </div>
        );
    }

    const { insuranceDto, contrDt, expireDt } = assetData;
    const instNm = insuranceDto.instNm ?? '보험사 정보 없음';
    const accountNm = insuranceDto.accountNm ?? '상품명 정보 없음';
    const monthlyPremAmt = insuranceDto.monthlyPremAmt ?? 0;

    return (
        <div className="flex min-h-screen flex-col bg-white">

            <main className="flex flex-col items-center gap-6 px-6 py-6 pb-24">
                <div className="w-full">
                    <p className="text-[14px] text-hana-black-500">{instNm}</p>
                    <h2 className="mt-1 font-bold text-[24px] text-hana-black-900 leading-tight">
                        {accountNm}
                    </h2>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-[15px] text-hana-black-500">월 납입보험료</span>
                        <span className="font-bold text-[22px] text-hana-black-900 tracking-tight">
                            {formatKoreanCurrency(monthlyPremAmt)}
                        </span>
                    </div>
                </div>

                <InfoListCard
                    title="보험 정보"
                    items={[
                        {
                            label: '보험사',
                            value: instNm
                        },
                        {
                            label: '상품명',
                            value: accountNm
                        },
                        {
                            label: '월 보험료',
                            value: formatKoreanCurrency(monthlyPremAmt)
                        },
                        {
                            label: '가입일',
                            value: formatDate(contrDt)
                        },
                        {
                            label: '만기일',
                            value: formatDate(expireDt)
                        },
                    ]}
                />

                <div className="w-full px-2 text-[13px] text-gray-400">
                    * 본 정보는 마이데이터 연동을 통해 제공되는 정보입니다.
                    {insuranceDto.username && <p className="mt-1">계약자: {insuranceDto.username}</p>}
                </div>
            </main>
        </div>
    );
}