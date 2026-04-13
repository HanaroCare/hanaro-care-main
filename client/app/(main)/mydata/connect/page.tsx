'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import FormInput from '@/components/baseelements/FormInput';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import ProgressBar from '@/components/baseelements/ProgressBar';
import CompleteStep from '@/components/modules/CompleteStep';
import DualActionFooter from '@/components/modules/DualActionFooter';
import PageHeading from '@/components/typography/PageHeading';
import LoadingStep from '../components/LoadingStep';

// 단계 타입 정의
type GoldStep = 'input' | 'result' | 'loading' | 'complete';

export default function GoldPage() {
  const router = useRouter();

  // 상태 관리
  const [step, setStep] = useState<GoldStep>('input');
  const [weight, setWeight] = useState('');
  const [purity, setPurity] = useState('');

  const isFormValid = weight.trim() !== '' && purity.trim() !== '';

  // 로딩 완료 핸들러
  const handleLoadingComplete = () => {
    setStep('complete');
  };

  return (
    <div className="app-shell bg-background">
      <div className="app-layout relative overflow-hidden">
        <div className="relative flex flex-1 flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-1 flex-col"
            >
              {/* --- 1. 정보 입력 단계 --- */}
              {step === 'input' && (
                <div className="flex h-full flex-col px-6 pt-6 pb-12">
                  <div className="mb-10">
                    <ProgressBar step={6} total={6} />
                  </div>
                  <PageHeading>
                    <span className="text-hana-teal-500">금 중량 및 함량</span>
                    을{'\n'}
                    입력해주세요
                  </PageHeading>
                  <div className="mt-8 flex flex-col gap-6">
                    <FormInput
                      label="금 중량"
                      id="goldWeight"
                      type="number"
                      placeholder="18"
                      value={weight}
                      onChange={setWeight}
                      suffix={
                        <span className="flex h-14 items-center pr-4 font-medium text-hana-black-400">
                          g
                        </span>
                      }
                    />
                    <FormInput
                      label="금 함량"
                      id="goldPurity"
                      type="number"
                      placeholder="24"
                      value={purity}
                      onChange={setPurity}
                      suffix={
                        <span className="flex h-14 items-center pr-4 font-medium text-hana-black-400">
                          k
                        </span>
                      }
                    />
                  </div>
                  <div className="mt-auto">
                    <PrimaryButton
                      label="확인"
                      variant={isFormValid ? 'primary' : 'disabled'}
                      onClick={() => isFormValid && setStep('result')}
                    />
                  </div>
                </div>
              )}

              {/* --- 2. 결과 확인 단계 --- */}
              {step === 'result' && (
                <div className="flex h-full flex-col px-6 pt-6 pb-12">
                  <div className="flex-1">
                    <div className="mb-10">
                      <ProgressBar step={6} total={6} />
                    </div>
                    <PageHeading>
                      <span className="text-hana-teal-500">조회된 금 자산</span>
                      을{'\n'}확인해주세요
                    </PageHeading>
                    <div className="mt-8 rounded-[20px] border border-border-gray bg-white p-6 shadow-sm">
                      <div className="mb-6 flex items-center justify-between border-border-gray border-b pb-4">
                        <span className="font-bold text-[18px] text-hana-black-900">
                          보유 금 자산
                        </span>
                        <span className="rounded-full bg-hana-teal-50 px-3 py-1 font-medium text-[12px] text-hana-teal-700">
                          실물 자산
                        </span>
                      </div>
                      <div className="flex flex-col gap-4 text-[15px]">
                        <div className="flex justify-between">
                          <span className="text-hana-black-500">중량</span>
                          <span className="font-semibold text-hana-black-900">
                            {weight}g
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-hana-black-500">
                            함량 (순도)
                          </span>
                          <span className="font-semibold text-hana-black-900">
                            {purity}K
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DualActionFooter
                    leftLabel="다시 입력하기"
                    rightLabel="완료"
                    onLeftClick={() => setStep('input')}
                    onRightClick={() => setStep('loading')}
                  />
                </div>
              )}

              {step === 'loading' && (
                <LoadingStep onComplete={handleLoadingComplete} />
              )}

              {step === 'complete' && (
                <CompleteStep
                  footer={
                    <PrimaryButton
                      label="확인하기"
                      onClick={() => router.push('/mydata/main')}
                    />
                  }
                >
                  <div className="flex flex-col items-center text-center">
                    <h2 className="whitespace-pre-line font-bold text-[1.5rem] text-foreground leading-[1.4] tracking-tight">
                      실물 자산을{'\n'}다 불러왔어요!
                    </h2>
                    <p className="mt-3 text-[1rem] text-muted-foreground">
                      연동된 자산 정보는 내 자산 탭에서{'\n'}언제든지 확인할 수
                      있어요.
                    </p>
                  </div>
                </CompleteStep>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
