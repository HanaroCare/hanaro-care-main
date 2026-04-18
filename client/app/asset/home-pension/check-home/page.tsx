'use client';

import { BellRing } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import {
  getLinkedHouses,
  getPensionForecast,
  type LinkedHouse,
} from '@/app/asset/actions/pension';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import { AlertBanner } from '@/components/modules/AlertBanner';
import Header from '@/components/navigation/Header';

function formatEok(amount: number) {
  const eok = Math.floor(amount / 100_000_000);
  const rest = Math.floor((amount % 100_000_000) / 10_000);

  if (eok > 0 && rest > 0) return `약 ${eok}억 ${rest.toLocaleString()}만`;
  if (eok > 0) return `약 ${eok}억`;
  return `약 ${rest.toLocaleString()}만`;
}

export default function CheckHomePage() {
  const router = useRouter();

  const [houses, setHouses] = useState<LinkedHouse[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data = await getLinkedHouses();
        setHouses(data);
      } catch (error) {
        console.error('연동 주택 조회 실패', error);
        setErrorMessage('연동된 주택 정보를 불러오지 못했어요.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHouses();
  }, []);

  const handleSelect = (id: number) => {
    setSelectedId(id);
  };

  const handleStartForecast = () => {
    if (!selectedId || isPending) return;

    startTransition(async () => {
      try {
        const forecast = await getPensionForecast(selectedId, 5);

        sessionStorage.setItem(
          'pensionForecastResult',
          JSON.stringify(forecast),
        );

        router.push(`/asset/home-pension/predict?id=${selectedId}`);
      } catch (error) {
        console.error('AI 집값 예측 실패', error);
        setErrorMessage('AI 집값 예측을 불러오지 못했어요. 다시 시도해주세요.');
      }
    });
  };

  const OVER_LIMIT_PRICE = 1_200_000_000;

  const selectedHouse = houses.find(
    (house) => house.realAssetId === selectedId,
  );

  const shouldShowPrivatePensionGuide =
    selectedHouse?.price != null && selectedHouse.price > OVER_LIMIT_PRICE;

  return (
    <div className="app-shell bg-white">
      <div className="app-layout bg-white">
        <Header title="주택 연금 대상 선택" />

        <main className="app-main no-scrollbar px-6 pt-8 pb-8">
          <section>
            <h2 className="text-[16px] leading-6 font-semibold tracking-tight text-[#1F2937]">
              마이데이터 연동 주택
            </h2>

            <div className="mt-4 flex flex-col gap-4">
              {isLoading && (
                <p className="text-[14px] text-[#9CA3AF]">불러오는 중...</p>
              )}

              {!isLoading && houses.length === 0 && (
                <p className="text-[14px] text-[#9CA3AF]">
                  연동된 주택 정보가 없어요.
                </p>
              )}

              {houses.map((house) => {
                const isSelected = selectedId === house.realAssetId;

                return (
                  <button
                    key={house.realAssetId}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleSelect(house.realAssetId)}
                    className={`w-full cursor-pointer rounded-[28px] border px-7 py-7 text-left shadow-[0_2px_10px_rgba(0,0,0,0.03)] outline-none transition-all focus:ring-2 focus:ring-hana-ez-600 ${
                      isSelected
                        ? 'border-hana-ez-600 bg-[#F0FDFD]'
                        : 'border-[#E5E7EB] bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="break-keep text-[18px] leading-7 font-bold tracking-tight text-[#111827]">
                          {house.address}
                        </p>
                        <div className="mt-1 flex flex-col gap-0.5">
                          {house.detail.map((line, i) => (
                            <p key={i} className="text-[14px] leading-5 font-medium tracking-tight text-[#6B7280]">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="whitespace-nowrap text-[20px] leading-7 font-bold tracking-tight text-[#111827]">
                          {formatEok(house.price)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {errorMessage && (
              <p className="mt-4 text-[14px] leading-5 text-[#EF4444]">
                {errorMessage}
              </p>
            )}

            {shouldShowPrivatePensionGuide && (
              <>
                <div className="mt-20">
                  <AlertBanner
                    variant="success"
                    icon={<BellRing size={22} aria-hidden="true" />}
                    message={
                      '주택 가격이 12억이 초과되어도\n아래 상품에 가입할 수 있어요!'
                    }
                  />
                </div>

                <div className="mt-3 rounded-[28px] border border-[#E5E7EB] bg-white px-7 py-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-[18px] leading-10 font-bold tracking-tight text-[#111827]">
                        하나 내집연금
                      </p>
                    </div>
                    <div className="shrink-0 whitespace-nowrap rounded-full bg-[#E9F8F9] px-3 py-2 text-[13px] leading-5 font-semibold tracking-tight text-hana-ez-600">
                      거주 유지
                    </div>
                  </div>

                  <div className="mt-2 space-y-2">
                    <p className="text-[14px] leading-7 font-medium tracking-tight text-[#6B7280]">
                      • 12억 초과 주택도 가입가능한 민간 역모기지론
                    </p>
                    <p className="text-[14px] leading-4 font-medium tracking-tight text-[#6B7280]">
                      • 하나은행 자체 상품 → 집에 살면서 연금 수령
                    </p>
                  </div>

                  <p className="mt-6 text-[19px] leading-4 font-bold tracking-tight text-hana-ez-600">
                    월 약 300만원 수령 가능
                  </p>
                </div>
              </>
            )}
          </section>
        </main>

        <footer className="shrink-0 bg-white px-6 py-4">
          <PrimaryButton
            label={isPending ? 'AI 집값 예측 중...' : 'AI 집값 예측 시작'}
            disabled={selectedId === null || isPending}
            onClick={handleStartForecast}
            className={`h-14 rounded-2xl text-[16px] leading-6 transition-colors ${
              selectedId === null ? 'opacity-50' : 'opacity-100'
            }`}
          />
        </footer>
      </div>
    </div>
  );
}
