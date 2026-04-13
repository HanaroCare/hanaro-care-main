'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Coins, Info, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import Header from '@/components/navigation/Header';

/**
 * 금 시세 조회 및 등록 페이지
 */
export default function GoldAssetPage() {
  const router = useRouter();
  const [step, setStep] = useState<'input' | 'result'>('input');
  const [weight, setWeight] = useState('');
  const [purity, setPurity] = useState('24K');

  const handleBack = () => {
    if (step === 'result') setStep('input');
    else router.back();
  };

  return (
    <div className="app-shell bg-background">
      <div className="app-layout relative overflow-hidden">
        <Header
          title="금 시세 조회"
          onBack={handleBack}
          onClose={() => router.push('/asset')}
        />

        <main className="app-main flex flex-1 flex-col px-[1.5rem] pt-[2.5rem]">
          <AnimatePresence mode="wait">
            {step === 'input' ? (
              <motion.div
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-1 flex-col"
              >
                <h2 className="mb-[2.5rem] font-bold text-[1.5rem] text-foreground leading-[1.4] tracking-tight">
                  보유하신 금의
                  <br />
                  정보를 입력해 주세요
                </h2>

                <div className="flex flex-col gap-[2.5rem]">
                  <div className="flex flex-col gap-[1rem]">
                    <label
                      htmlFor="gold-type"
                      className="ml-1 font-bold text-base text-hana-black-900"
                    >
                      금 함량 선택
                    </label>
                    <div className="grid grid-cols-3 gap-[0.75rem]">
                      {['24K', '18K', '14K'].map((k) => (
                        <button
                          key={k}
                          onClick={() => setPurity(k)}
                          className={`rounded-4xl border-2 py-[1.125rem] font-black text-[1.0625rem] transition-all ${
                            k === purity
                              ? 'border-primary bg-primary/5 text-primary shadow-md'
                              : 'border-gray-100 bg-white text-gray-400'
                          }`}
                        >
                          {k}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-[1rem]">
                    <label
                      htmlFor="gold-weight"
                      className="ml-1 font-bold text-[0.9375rem] text-hana-black-900"
                    >
                      보유 중량
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="0.00"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="h-[4.25rem] w-full rounded-[1.25rem] border-2 border-gray-100 px-[1.5rem] pr-[4rem] text-right font-black text-[1.75rem] outline-none transition-all focus:border-primary"
                      />
                      <span className="-translate-y-1/2 absolute top-1/2 right-[1.5rem] font-black text-[1.25rem] text-gray-400">
                        g
                      </span>
                    </div>
                    <p className="px-1 text-right font-medium text-[0.875rem] text-muted-foreground">
                      약 {(Number(weight || 0) / 3.75).toFixed(2)}돈
                    </p>
                  </div>
                </div>

                <div className="mt-auto pb-[3rem]">
                  <PrimaryButton
                    label="시세 확인하기"
                    disabled={!weight}
                    onClick={() => setStep('result')}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-1 flex-col"
              >
                <h2 className="mb-[2rem] font-bold text-[1.375rem] text-foreground tracking-tight">
                  금 보유 현황
                </h2>

                <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#FFD700] via-[#E6B800] to-[#B8860B] p-[2.25rem] text-white shadow-[0_20px_50px_rgba(230,184,0,0.3)]">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                  <div className="-right-8 -bottom-8 absolute rotate-[15deg] text-white opacity-20">
                    <Coins size={180} strokeWidth={1} />
                  </div>

                  <div className="relative z-10">
                    <div className="mb-[3.5rem] flex items-start justify-between">
                      <div>
                        <p className="mb-[0.5rem] font-bold text-[0.9375rem] text-white/80 tracking-tight">
                          {purity} Gold
                        </p>
                        <h3 className="font-black text-[2.25rem] leading-none">
                          {weight}g
                        </h3>
                        <p className="mt-2 font-bold text-[1rem] text-white/90">
                          {(Number(weight) / 3.75).toFixed(1)}돈
                        </p>
                      </div>
                      <div className="rounded-[1.25rem] border border-white/30 bg-white/20 p-[1rem] shadow-inner backdrop-blur-md">
                        <Coins size={32} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-white/20 border-t pt-[1.75rem]">
                      <span className="font-bold text-[1rem] text-white/80">
                        평가 금액
                      </span>
                      <span className="font-black text-[1.875rem]">
                        3,203,250원
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-[2rem] flex flex-col gap-[1rem]">
                  <div className="flex items-center gap-[0.875rem] rounded-[1.25rem] border border-hana-ez-100 bg-hana-ez-50 p-[1.25rem]">
                    <div className="rounded-full bg-primary p-2 text-white">
                      <TrendingUp size={18} />
                    </div>
                    <p className="font-bold text-[0.875rem] text-primary tracking-tight">
                      전일 대비 시세가 1.2% 상승했습니다.
                    </p>
                  </div>

                  <div className="flex items-center gap-[0.5rem] px-[0.5rem]">
                    <Info size={14} className="text-gray-400" />
                    <p className="font-medium text-[0.75rem] text-gray-400">
                      기준 시세: 85,420원/1g (실시간)
                    </p>
                  </div>
                </div>

                <div className="mt-auto pb-[3rem]">
                  <PrimaryButton
                    label="확인"
                    onClick={() => router.push('/asset?tab=gold')}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
