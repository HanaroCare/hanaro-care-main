'use client';

import Header from '@/components/navigation/Header';
import { InfoListCard } from '@/components/modules/InfoListCard';
import { AssetChart } from '../../components/AssetChart';
import { formatKoreanCurrency } from '../../utils/formatCurrency';
import { AssetDetailResponse } from '../../utils/types';

interface Props {
    assetData: AssetDetailResponse | null;
}

type VehicleDesc = { brand?: string; model?: string; details?: string; car_number?: string };

function parseVehicleDesc(desc: string | null | undefined): VehicleDesc {
    if (!desc) return {};
    try {
        return JSON.parse(desc) as VehicleDesc;
    } catch {
        return {};
    }
}

export default function CarDetailClient({ assetData }: Props) {

    if (!assetData) {
        return (
            <div className="flex min-h-screen flex-col bg-white">
                <Header title="자동차 상세" />
                <div className="flex flex-1 items-center justify-center text-hana-black-400">
                    데이터를 불러올 수 없습니다.
                </div>
            </div>
        );
    }

    const parsed = parseVehicleDesc(assetData.assetDesc);
    const brand = parsed.brand ?? '';
    const model = parsed.model ?? '';
    const detailParts = (parsed.details ?? '').split(' · ');
    const regDt = detailParts[0] ?? '';
    const mileage = detailParts[1] ?? '';
    const carNumber = parsed.car_number ?? '정보 없음';
    const subtitle = [[brand, model].filter(Boolean).join(' '), regDt].filter(Boolean).join(' · ');

    const carInfo = {
        priceChange: 1500000,
        changePercent: 3.2,
        fuel: '가솔린',
    };

    const isDecrease = carInfo.priceChange < 0;
    const changeIcon = isDecrease ? '▼' : '▲';

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Header title="자동차 상세" showBackButton={true} />

            <main className="flex flex-col items-center gap-6 px-6 py-6 pb-24">
                <div className="w-full">
                    <h2 className="font-bold text-[24px] text-hana-black-900 leading-tight">
                        {assetData.assetNm}
                    </h2>
                    <p className="mt-1 text-[15px] text-hana-black-500">
                        {subtitle}
                    </p>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="font-bold text-[28px] text-hana-black-900 tracking-tight">
                            {formatKoreanCurrency(assetData.amount)}
                        </span>
                        <span className="font-medium text-[15px] text-hana-blue-500">
                            {changeIcon} {formatKoreanCurrency(Math.abs(carInfo.priceChange))} ({Math.abs(carInfo.changePercent)}%)
                        </span>
                    </div>
                </div>

                <AssetChart
                    title="중고차 시세 변화"
                    subtitle="최근 6개월 기준 (단위: 만원)"
                    data={[
                        { name: '11월', value: 4800 },
                        { name: '12월', value: 4750 },
                        { name: '1월', value: 4700 },
                        { name: '2월', value: 4650 },
                        { name: '3월', value: 4600 },
                        { name: '4월', value: assetData.amount / 10000 }, // 현재가를 만원 단위로 변환
                    ]}
                    config={{
                        type: 'line',
                        color: '#008485',
                        domain: [4400, 4900],
                        ticks: [4400, 4650, 4900],
                    }}
                />

                <InfoListCard
                    title="차량 정보"
                    items={[
                        { label: '차량명', value: assetData.assetNm },
                        { label: '차량번호', value: carNumber },
                        { label: '연식', value: regDt || '정보 없음' },
                        { label: '주행', value: mileage || '정보 없음' },
                        { label: '연료', value: carInfo.fuel },
                    ]}
                />

                <InfoListCard
                    title="유지비 예상"
                    items={[
                        { label: '자동차세', value: '약 52만원/년' },
                        { label: '보험료', value: '약 110만원/년' },
                        { label: '소모품 교체', value: '6개월 이내 없음' },
                    ]}
                />
            </main>
        </div>
    );
}
