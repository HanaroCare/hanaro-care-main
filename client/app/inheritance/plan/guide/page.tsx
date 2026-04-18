'use client';

import { Lightbulb, Scale, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Header from '@/components/navigation/Header';

import PrimaryButton from '@/components/baseelements/PrimaryButton';
import PageHeading from '@/components/typography/PageHeading';
import PageDescription from '@/components/typography/PageDescription';
import InfoBox from "@/components/modules/InfoBox";

export default function InheritanceGuidePage() {
  const router = useRouter();

  return (
      <div className="app-shell bg-white">
        <div className="app-layout">
          <Header title="상속 설계 가이드" showBackButton={true} />

          <div className="app-main no-scrollbar px-6">
            <header className="mt-8 mb-10">
              {/* PageHeading 내부의 whitespace-pre-wrap 덕분에 \n이 작동합니다 */}
              <PageHeading className="mb-3 !text-left text-2xl font-bold">
                법적으로 안전한{'\n'}
                <span className="text-hana-ez-600">상속 비율</span>을 확인하세요
              </PageHeading>
              <PageDescription className="!text-left text-base">
                상속인들의 권리를 보호하기 위해{'\n'}
                법으로 정해진 최소한의 비율이 있어요.
              </PageDescription>
            </header>

            {/* 법정상속분 섹션 */}
            <section className="mb-8">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-hana-ez-50">
                  <Scale size={18} className="text-hana-ez-600" />
                </div>
                <h2 className="font-bold text-lg text-hana-black-900">법정상속분</h2>
              </div>

              {/* InfoBox를 사용하여 설명과 카드를 구성 */}
              <div className="rounded-[24px] border border-gray-100 bg-gray-50/50 p-5">
                <p className="mb-4 text-sm leading-relaxed text-gray-600">
                  상속인들 사이에 협의가 되지 않을 때{'\n'}
                  법이 정한 상속 비율이에요.
                </p>
                <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">배우자</span>
                    <span className="font-bold text-hana-ez-600">1.5</span>
                  </div>
                  <div className="h-[1px] w-full bg-gray-50" />
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">자녀</span>
                    <span className="font-bold text-hana-ez-600">1.0</span>
                  </div>
                  <p className="mt-1 text-[11px] text-gray-400">
                    * 배우자는 자녀보다 50%를 더 상속받게 됩니다.
                  </p>
                </div>
              </div>
            </section>

            {/* 유류분 섹션 */}
            <section className="mb-8">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-hana-ez-50">
                  <ShieldCheck size={18} className="text-hana-ez-600" />
                </div>
                <h2 className="font-bold text-lg text-hana-black-900">유류분</h2>
              </div>
              <div className="rounded-[24px] border border-gray-100 bg-gray-50/50 p-5">
                <p className="mb-4 text-sm leading-relaxed text-gray-600">
                  상속인의 생계를 보호하기 위해{'\n'}
                  법으로 보장된 최소한의 상속 금액이에요.
                </p>
                <div className="rounded-2xl bg-white p-4 shadow-sm border-l-4 border-hana-red-400">
                  <div className="mb-2 flex items-center justify-between">
                  <span className="font-bold text-hana-black-900 text-sm">
                    법정상속분의 1/2
                  </span>
                    <span className="rounded-full bg-hana-red-50 px-3 py-0.5 font-bold text-[10px] text-hana-red-500">
                    최소 보장
                  </span>
                  </div>
                  <p className="text-[12px] text-gray-500 leading-snug">
                    상속인이 법정상속분의 절반도 받지 못하면,{'\n'}
                    다른 상속인에게 부족한 만큼 돌려받을 수 있어요.
                  </p>
                </div>
              </div>
            </section>

            {/* 꿀팁 박스 (InfoBox 활용) */}
            <InfoBox
                title="꼭 알아두세요!"
                desc="내 마음대로 상속 비율을 정하더라도, 유류분을 침해하면 나중에 가족 간 분쟁이 생길 수 있어요."
                className="mb-10"
            />
          </div>

          <footer className="shrink-0 bg-white px-6 pb-10 pt-4">
            <PrimaryButton
                label="확인했습니다"
                variant="primary"
                onClick={() => router.push('/inheritance/plan')}
            />
          </footer>
        </div>
      </div>
  );
}