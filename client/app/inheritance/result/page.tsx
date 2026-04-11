'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import InfoBox from '@/components/InfoBox';
import NextButton from '@/components/NextButton';

export default function InheritanceResultPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [planData, setPlanData] = useState<{ heirs: any[], totalAsset: number } | null>(null);

  useEffect(() => {
    // 페이지 진입 시 완료 상태 저장
    localStorage.setItem('inheritance_completed', 'true');
    
    // 저장된 플랜 데이터 불러오기
    const savedPlan = localStorage.getItem('inheritance_plan');
    if (savedPlan) {
      setPlanData(JSON.parse(savedPlan));
    }
  }, []);

  const handleConfirmReset = () => {
    localStorage.removeItem('inheritance_completed');
    localStorage.removeItem('inheritance_plan');
    router.push('/inheritance/plan');
    setIsModalOpen(false);
  };

  if (!planData) return null;

  const { heirs, totalAsset } = planData;

  // 법정상속분 가중치 계산 (배우자 1.5, 자녀 1)
  const spouse = heirs.find(h => h.name === '배우자');
  const childrenCount = heirs.filter(h => h.name.startsWith('자녀')).length;
  const totalWeight = (spouse ? 1.5 : 0) + childrenCount;

  const getComputedData = (heir: any) => {
    const weight = heir.name === '배우자' ? 1.5 : 1;
    const legalShareRatio = weight / totalWeight;
    const legalShareAmount = totalAsset * legalShareRatio;
    const forcedShareAmount = legalShareAmount * 0.5; // 유류분은 법정상속분의 1/2
    const myAmount = totalAsset * (heir.percentage / 100);
    const diff = myAmount - forcedShareAmount;
    
    return {
      myAmount: myAmount.toFixed(2),
      legalShareAmount: legalShareAmount.toFixed(2),
      forcedShareAmount: forcedShareAmount.toFixed(2),
      diff: Math.abs(diff).toFixed(2),
      status: diff >= 0 ? 'positive' : 'negative'
    };
  };

  const colors = ['#015E5F', '#1EB1B2', '#8DC8C8', '#BDAE7F'];

  return (
    <div className="app-shell bg-white relative">
      <div className="app-layout">
        {/* Header Tabs */}
        <header className="flex px-6 pt-4 gap-6 border-b border-gray-100 bg-white z-20 shrink-0 text-base">
          <Link href="/inheritance/plan" className="pb-2 text-gray-400 font-medium">
            자산
          </Link>
          <div className="pb-2 text-hana-ez-600 font-bold border-b-2 border-hana-ez-600">
            상속
          </div>
        </header>

        <main className="app-main no-scrollbar px-6 pt-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">상속설계 결과</h1>
          
          <section className="flex flex-col items-center mb-8">
            <div className="relative w-[180px] h-[180px] mb-6">
              <Image 
                src="/images/inheritance/chart.svg" 
                alt="상속 비율 차트" 
                fill
                className="object-contain"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm text-gray-500">상속비율</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {heirs.map((h, i) => (
                <div key={h.id} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                  <span className="text-xs text-gray-600 font-medium">{h.name} ( {h.percentage}% )</span>
                </div>
              ))}
            </div>
          </section>

          {/* Member Details */}
          <div className="space-y-4 mb-8">
            {heirs.map((h, i) => {
              const data = getComputedData(h);
              return (
                <div key={h.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-xl">
                        {h.icon}
                      </div>
                      <span className="font-bold">{h.name}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                      data.status === 'positive' ? 'bg-[#EEFFFC] text-[#01A5AC]' : 'bg-[#FFF1F1] text-[#F04452]'
                    }`}>
                      유류분보다 {data.status === 'positive' ? `+${data.diff}억원` : `-${data.diff}억원`}
                    </div>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">내가 정한 금액</span>
                      <span className="text-lg font-bold text-hana-ez-600">{data.myAmount}억원</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>법정상속분</span>
                      <span>{data.legalShareAmount}억원</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>유류분</span>
                      <span>{data.forcedShareAmount}억원</span>
                    </div>
                  </div>
                  <Link href={`/inheritance/letter/${h.id}`} className="text-xs text-gray-400 font-medium flex items-center">
                    상속편지 남기기 <span className="ml-1">&gt;</span>
                  </Link>
                </div>
              );
            })}
          </div>

          <InfoBox 
            title="상속 전문가의 팁" 
            desc="유류분보다 부족하게 설정된 경우 향후 분쟁의 소지가 있을 수 있습니다. 유언대용신탁을 활용하면 보다 안전한 상속 집행이 가능합니다."
            className="mb-8"
          />

          <div className="mb-10">
            <NextButton 
              label="상속 설계 다시하기" 
              onClick={() => setIsModalOpen(true)} 
            />
          </div>
        </main>
      </div>

      {/* 앱 내 커스텀 모달 (팝업) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 animate-in fade-in duration-200" onClick={() => setIsModalOpen(false)}>
          <div className="w-full max-w-[327px] bg-white rounded-[32px] p-8 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4 whitespace-pre-wrap leading-tight text-center">
              상속 설계를{"\n"}다시 시작하시겠습니까?
            </h2>
            <p className="text-gray-500 text-sm mb-8 text-center leading-relaxed">
              지금까지 설정한 상속 비율이{"\n"}모두 초기화됩니다.
            </p>
            
            <div className="flex gap-3">
              <button 
                className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-500 font-bold text-base" 
                onClick={() => setIsModalOpen(false)}
              >
                취소
              </button>
              <button 
                className="flex-1 py-4 rounded-2xl bg-hana-ez-600 text-white font-bold text-base" 
                onClick={handleConfirmReset}
              >
                다시하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
