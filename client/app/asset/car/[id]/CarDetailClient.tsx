'use client';

import Header from '@/components/navigation/Header';
import { AssetDetailLayout } from '../../components/AssetDetailLayout';
import type { AssetDetailResponse } from '../../utils/types';

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

    const currentAmount = assetData.amount ?? 0;
    const subtitle = [[brand, model].filter(Boolean).join(' '), regDt].filter(Boolean).join(' · ');

    const carInfo = {
        priceChange: -1500000,
        changePercent: -3.2,
        fuel: '가솔린',
    };

    const changeColorClass = carInfo.priceChange >= 0 ? 'text-red-500' : 'text-blue-500';

    return (
        <AssetDetailLayout
            headerTitle="자동차 상세"
            name={assetData.assetNm || '정보 없음'}
            subtitle={subtitle}
            amount={currentAmount}
            priceChange={carInfo.priceChange}
            changePercent={carInfo.changePercent}
            changeColorClass={changeColorClass}
            chart={{
                title: '중고차 시세 변화',
                subtitle: '최근 6개월 기준 (단위: 만원)',
                data: [
                    { name: '11월', value: 4800 },
                    { name: '12월', value: 4750 },
                    { name: '1월', value: 4700 },
                    { name: '2월', value: 4650 },
                    { name: '3월', value: 4600 },
                    { name: '4월', value: Math.floor(currentAmount / 10000) },
                ],
                config: {
                    type: 'line',
                    color: '#008485',
                    domain: [4400, 4900],
                    ticks: [4400, 4650, 4900],
                },
            }}
            sections={[
                {
                    title: '차량 정보',
                    items: [
                        { label: '차량명', value: assetData.assetNm || '정보 없음' },
                        { label: '차량번호', value: carNumber },
                        { label: '연식', value: regDt || '정보 없음' },
                        { label: '주행', value: mileage || '정보 없음' },
                        { label: '연료', value: carInfo.fuel },
                    ],
                },
                {
                    title: '유지비 예상',
                    items: [
                        { label: '자동차세', value: '약 52만원/년' },
                        { label: '보험료', value: '약 110만원/년' },
                        { label: '소모품 교체', value: '6개월 이내 없음' },
                    ],
                },
            ]}
        />
    );
}
