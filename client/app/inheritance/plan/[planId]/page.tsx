'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import TrustStepLayout from '@/app/asset/components/trust/TrustStepLayout';
import TrustProgressBar from '@/app/asset/components/trust/TrustProgressBar';
import NextButton from '@/components/NextButton';

interface Heir {
  id: number;
  name: string;
  percentage: number;
  icon: string;
}

export default function InheritancePlanDetailPage() {
  const router = useRouter();
  const [heirs, setHeirs] = useState<Heir[]>([
    { id: 1, name: '배우자', percentage: 40, icon: '👵' },
    { id: 2, name: '자녀1', percentage: 20, icon: '👨' },
    { id: 3, name: '자녀2', percentage: 20, icon: '👩' },
    { id: 4, name: '자녀3', percentage: 20, icon: '🧑' },
  ]);

  const [editingHeir, setEditingHeir] = useState<Heir | null>(null);
  const [tempPercentage, setTempPercentage] = useState<number>(0);

  useEffect(() => {
    if (editingHeir) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [editingHeir]);

  const totalPercentage = useMemo(() => 
    heirs.reduce((sum, h) => sum + h.percentage, 0), [heirs]);

  const totalAsset = 13.4;

  const handleCardClick = (heir: Heir) => {
    setEditingHeir(heir);
    setTempPercentage(heir.percentage);
  };

  const otherTotal = totalPercentage - (editingHeir?.percentage || 0);
  const maxVal = 100 - otherTotal;

  const confirmChange = () => {
    if (editingHeir) {
      setHeirs(prev => prev.map(h => 
        h.id === editingHeir.id ? { ...h, percentage: tempPercentage } : h
      ));
      setEditingHeir(null);
    }
  };

  const handleComplete = () => {
    if (totalPercentage === 100) {
      localStorage.setItem('inheritance_completed', 'true');
      localStorage.setItem('inheritance_plan', JSON.stringify({
        heirs,
        totalAsset
      }));
      router.push('/inheritance/result');
    }
  };

  return (
    <TrustStepLayout
      footer={
        <div className="px-6 pb-8 bg-white">
          <NextButton 
            label={totalPercentage === 100 ? '설정 완료' : '비율의 합을 100%로 맞춰주세요'} 
            disabled={totalPercentage !== 100}
            onClick={handleComplete}
          />
        </div>
      }
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-14 bg-white shrink-0">
        <Link href="/inheritance/plan" className="p-2" aria-label="뒤로가기">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <span className="text-lg font-semibold">상속 설계</span>
        <Link href="/inheritance" className="p-2" aria-label="닫기">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </header>

      <div className="px-6">
        <div className="py-2">
          <TrustProgressBar step={2} total={5} />
        </div>

        <main className="pt-6 pb-10">
          <h1 className="text-2xl font-bold mb-6 whitespace-pre-wrap leading-tight">상속 비율을{"\n"}자유롭게 조정해보세요</h1>
          
          <div className="flex justify-center mb-8">
            <Image src="/images/inheritance/inheritance-edit-chart.svg" alt="상속 비율 차트" width={327} height={200} priority />
          </div>

          <div className="bg-gray-50 rounded-3xl p-6 mb-6">
            <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
              <span>전체 상속 자산</span>
              <span className="font-bold text-gray-900">{totalAsset}억원</span>
            </div>
            <div className="flex justify-between items-center px-4 py-3 bg-white rounded-2xl border border-hana-ez-600/20 shadow-sm">
              <span className="text-sm font-medium">설정된 비율 합계</span>
              <span className="text-gray-400 text-sm">
                <span className="text-hana-ez-600 font-bold text-lg">{totalPercentage}%</span> / 100%
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {heirs.map((heir) => (
              <button 
                key={heir.id} 
                type="button"
                aria-label={`${heir.name} 상속 비율 수정`}
                className="w-full text-left bg-white border border-gray-100 rounded-3xl p-5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer flex justify-between items-center" 
                onClick={() => handleCardClick(heir)}
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">{heir.icon}</div>
                  <span className="font-bold text-gray-800">{heir.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-hana-ez-600">{heir.percentage}%</div>
                  <div className="text-xs text-gray-400">약 {(totalAsset * (heir.percentage / 100)).toFixed(2)}억원</div>
                </div>
              </button>
            ))}
          </div>
        </main>
      </div>

      {editingHeir && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 animate-in fade-in duration-200" onClick={() => setEditingHeir(null)}>
          <div className="w-full max-w-[375px] bg-white rounded-t-[32px] p-8 animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-8 whitespace-pre-wrap leading-tight text-center">
              <span className="text-hana-ez-600">{editingHeir.name}</span>님에게{"\n"}얼마를 상속할까요?
            </h2>
            
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4 text-xs font-medium text-gray-400">
                <span>설정 가능 범위: 0% ~ {maxVal}%</span>
                <span className="text-lg font-bold text-hana-ez-600">{tempPercentage}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max={maxVal} 
                value={tempPercentage} 
                onChange={(e) => setTempPercentage(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-hana-ez-600"
              />
            </div>
            
            <div className="flex gap-3">
              <button 
                className="flex-1 py-4 rounded-xl bg-gray-100 text-gray-500 font-bold" 
                onClick={() => setEditingHeir(null)}
              >
                취소
              </button>
              <button 
                className="flex-1 py-4 rounded-xl bg-hana-ez-600 text-white font-bold" 
                onClick={confirmChange}
              >
                적용하기
              </button>
            </div>
          </div>
        </div>
      )}
    </TrustStepLayout>
  );
}
