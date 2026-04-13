'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, TrendingDown } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import Header from '@/components/navigation/Header';

/**
 * 자동차 조회 및 등록 플로우 페이지 (시안 1~2 반영)
 */
export default function CarAssetPage() {
  const router = useRouter();
  const [step, setStep] = useState<'input' | 'result'>('input');
  const [carNum, setCarNum] = useState('');

  const handleBack = () => {
    if (step === 'result') setStep('input');
    else router.back();
  };

  return (
    <div className="app-shell bg-background">
      <div className="app-layout relative overflow-hidden">
        <Header
          title="자동차 조회"
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
                <h2 className="mb-[2.5rem] font-bold text-[1.5rem] leading-[1.4] tracking-tight">
                  차량 번호를
                  <br />
                  입력해 주세요
                </h2>

                <div className="flex flex-col gap-[1rem]">
                  <input
                    type="text"
                    placeholder="예: 12가 3456"
                    value={carNum}
                    onChange={(e) => setCarNum(e.target.value)}
                    className="h-[4.25rem] w-full rounded-[1.25rem] border border-gray-200 px-[1.5rem] font-black text-[1.625rem] tracking-wider shadow-sm outline-none transition-all placeholder:font-normal placeholder:text-[1.0625rem] focus:border-primary"
                  />
                  <div className="flex items-start gap-[0.625rem] rounded-[1rem] bg-gray-50 px-[0.5rem] py-[1rem]">
                    <AlertCircle
                      size={16}
                      className="mt-0.5 shrink-0 text-gray-400"
                    />
                    <p className="text-[0.875rem] text-muted-foreground leading-relaxed">
                      소유주 명의의 차량만 조회가 가능하며,
                      <br />
                      등록 후 시세를 실시간으로 확인할 수 있습니다.
                    </p>
                  </div>
                </div>

                <div className="mt-auto pb-[3rem]">
                  <PrimaryButton
                    label="내 차 시세 확인하기"
                    disabled={carNum.length < 7}
                    onClick={() => setStep('result')}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-1 flex-col"
              >
                <h2 className="mb-[2rem] font-bold text-[1.375rem] text-foreground tracking-tight">
                  내 차 시세 결과
                </h2>

                <div className="overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
                  <div className="relative flex h-[12.5rem] items-center justify-center overflow-hidden bg-[#F1F3F5]">
                    {/* 차량 이미지 플레이스홀더 */}
                    <div className="flex flex-col items-center text-gray-300">
                      <Image
                        src="/images/mydata/car.svg"
                        alt="자동차 이미지"
                        width={260}
                        height={146}
                        className="h-[8.5rem] w-auto drop-shadow-sm"
                      />
                      <span className="mt-3 font-black text-[0.8125rem] uppercase tracking-[0.2em] opacity-50">
                        Genesis GV80
                      </span>
                    </div>
                    <div className="absolute top-[1.25rem] right-[1.25rem]">
                      <span className="rounded-full bg-primary px-[0.75rem] py-[0.375rem] font-bold text-[0.75rem] text-white shadow-lg">
                        조회완료
                      </span>
                    </div>
                  </div>

                  <div className="p-[1.75rem]">
                    <div className="mb-[1.75rem]">
                      <div className="mb-[0.5rem] flex items-center gap-[0.5rem]">
                        <span className="rounded-md bg-primary/10 px-[0.5rem] py-[0.125rem] font-bold text-[0.75rem] text-primary uppercase">
                          Genesis
                        </span>
                      </div>
                      <h3 className="font-black text-[1.5rem] text-foreground tracking-tight">
                        GV80 (2023년형)
                      </h3>
                      <p className="mt-1 font-semibold text-[1rem] text-muted-foreground">
                        {carNum}
                      </p>
                    </div>

                    <div className="flex items-end justify-between border-gray-100 border-t pt-[1.75rem]">
                      <div className="flex flex-col gap-[0.25rem]">
                        <span className="font-medium text-[0.9375rem] text-muted-foreground">
                          현재 예상 시세
                        </span>
                        <div className="flex items-center gap-[0.375rem] text-hana-red-500">
                          <TrendingDown size={14} />
                          <span className="font-bold text-[0.75rem]">
                            전월 대비 120만원 하락
                          </span>
                        </div>
                      </div>
                      <span className="font-black text-[1.75rem] text-foreground">
                        7,850만원
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pb-[3rem]">
                  <PrimaryButton
                    label="자산 등록 완료"
                    onClick={() => router.push('/asset?tab=car')}
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
