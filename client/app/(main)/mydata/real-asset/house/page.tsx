'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Building2,
  ChevronRight,
  MapPin,
  Search,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import Header from '@/components/navigation/Header';

type Step = 'search' | 'detail' | 'result';

/**
 * 부동산 조회 및 등록 플로우 페이지
 */
export default function HouseAssetPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('search');
  const [address, setAddress] = useState('');
  const [houseType, setHouseType] = useState('아파트');

  const handleBack = () => {
    if (step === 'search') router.back();
    else if (step === 'detail') setStep('search');
    else if (step === 'result') setStep('detail');
  };

  return (
    <div className="app-shell bg-background">
      <div className="app-layout relative overflow-hidden">
        <Header
          title="부동산 조회"
          onBack={handleBack}
          onClose={() => router.push('/asset')}
        />

        <main className="app-main flex flex-1 flex-col">
          <AnimatePresence mode="wait">
            {step === 'search' && (
              <motion.div
                key="search"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-1 flex-col px-[1.5rem] pt-[2.5rem]"
              >
                <h2 className="mb-[2rem] font-bold text-[1.5rem] leading-[1.4] tracking-tight">
                  살고 계신 <span className="text-primary">집의 주소</span>를
                  <br />
                  입력해 주세요
                </h2>

                <div className="group relative mb-[2rem]">
                  <input
                    type="text"
                    placeholder="도로명 주소 또는 단지명 검색"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="h-[4.25rem] w-full rounded-[1.25rem] border border-gray-200 pr-[3.5rem] pl-[1.25rem] font-semibold text-[1.0625rem] shadow-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                  <Search
                    className="-translate-y-1/2 absolute top-1/2 right-[1.25rem] text-gray-400 transition-colors group-focus-within:text-primary"
                    size={24}
                  />
                </div>

                <div className="flex flex-col gap-[1rem]">
                  <p className="ml-1 font-bold text-[0.9375rem] text-hana-black-900">
                    우리 집 특징
                  </p>
                  <div className="flex flex-wrap gap-[0.75rem]">
                    {['아파트', '빌라', '오피스텔', '단독주택'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setHouseType(t)}
                        className={`rounded-full border px-[1.25rem] py-[0.75rem] font-bold text-[0.875rem] transition-all ${
                          houseType === t
                            ? 'border-primary bg-primary text-white shadow-md'
                            : 'border-gray-200 bg-white text-gray-500'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pb-[3rem]">
                  <PrimaryButton
                    label="다음"
                    disabled={!address}
                    onClick={() => setStep('detail')}
                  />
                </div>
              </motion.div>
            )}

            {step === 'detail' && (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-1 flex-col px-[1.5rem] pt-[2.5rem]"
              >
                <h2 className="mb-[2.5rem] font-bold text-[1.5rem] leading-[1.4] tracking-tight">
                  <span className="text-primary">상세 정보</span>를<br />
                  확인해 주세요
                </h2>

                <div className="mb-[2.5rem] flex items-start gap-[1rem] rounded-[1.5rem] border border-gray-100 bg-gray-50 p-[1.75rem] shadow-inner">
                  <MapPin className="mt-1 shrink-0 text-primary" size={22} />
                  <span className="font-bold text-[1.125rem] text-foreground leading-snug">
                    {address}
                  </span>
                </div>

                <div className="space-y-[2rem]">
                  <div className="flex flex-col gap-[0.75rem]">
                    <label
                      htmlFor="building-info"
                      className="ml-1 font-black text-gray-400 text-sm uppercase"
                    >
                      동/호
                    </label>
                    <div className="flex gap-[1rem]">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="동"
                          className="h-[4rem] w-full rounded-[1rem] border border-gray-200 px-[1rem] text-center font-black text-[1.25rem] shadow-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="호"
                          className="h-[4rem] w-full rounded-[1rem] border border-gray-200 px-[1rem] text-center font-black text-[1.25rem] shadow-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[0.75rem]">
                    <label
                      htmlFor="area-size"
                      className="ml-1 font-black text-gray-400 text-sm uppercase"
                    >
                      면적 (㎡)
                    </label>
                    <button
                      type="button"
                      className="group flex h-[4.25rem] w-full items-center justify-between rounded-[1.25rem] border border-gray-200 bg-white px-[1.5rem] text-left shadow-sm transition-all hover:border-primary"
                    >
                      <span className="font-bold text-[1.0625rem] text-gray-400 group-focus:text-foreground">
                        면적을 선택해 주세요
                      </span>
                      <ChevronRight className="text-gray-300" size={20} />
                    </button>
                  </div>
                </div>

                <div className="mt-auto pb-[3rem]">
                  <PrimaryButton
                    label="조회하기"
                    onClick={() => setStep('result')}
                  />
                </div>
              </motion.div>
            )}

            {step === 'result' && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-1 flex-col px-[1.5rem] pt-[2.5rem]"
              >
                <h2 className="mb-[2rem] font-bold text-[1.375rem] text-foreground tracking-tight">
                  <span className="text-primary">조회 결과</span>입니다
                </h2>

                <div className="overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
                  <div className="relative flex h-[12.5rem] items-center justify-center overflow-hidden bg-[#F1F3F5]">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute right-[1.5rem] bottom-[1.5rem] left-[1.5rem]">
                      <div className="flex items-center gap-[0.75rem]">
                        <div className="rounded-lg bg-primary p-[0.5rem] text-white">
                          <Building2 size={24} />
                        </div>
                        <h3 className="font-black text-[1.25rem] text-white drop-shadow-md">
                          {address.split(' ').slice(-1)} 101동
                        </h3>
                      </div>
                    </div>
                    <div className="absolute top-[1.25rem] right-[1.25rem]">
                      <span className="rounded-full bg-primary px-[0.75rem] py-[0.375rem] font-bold text-[0.75rem] text-white shadow-lg">
                        조회완료
                      </span>
                    </div>
                  </div>

                  <div className="p-[1.75rem]">
                    <div className="mb-[1.75rem]">
                      <p className="font-semibold text-[0.9375rem] text-muted-foreground">
                        {address}
                      </p>
                    </div>

                    <div className="space-y-[1.25rem] border-gray-100 border-t pt-[1.75rem]">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[0.9375rem] text-muted-foreground">
                          최근 실거래가
                        </span>
                        <span className="font-black text-[1.5rem] text-primary tracking-tight">
                          15억 4,000만원
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[0.9375rem] text-muted-foreground">
                          공시지가
                        </span>
                        <span className="font-bold text-[1.125rem] text-foreground">
                          12억 1,000만원
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[0.9375rem] text-muted-foreground">
                          전용 면적
                        </span>
                        <span className="font-bold text-[1.125rem] text-foreground">
                          84.98㎡ (33평형)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-[1.5rem] flex items-start gap-[0.75rem] rounded-[1.25rem] border border-gray-100 bg-gray-50 p-[1.25rem]">
                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-gray-400"
                  />
                  <p className="text-[0.8125rem] text-muted-foreground leading-relaxed">
                    위 시세는 최근 국토교통부 실거래가 데이터를 기준으로
                    산정되었습니다. 실거래가와 차이가 있을 수 있습니다.
                  </p>
                </div>

                <div className="mt-auto pb-[3rem]">
                  <PrimaryButton
                    label="자산 등록 완료"
                    onClick={() => router.push('/asset?tab=realestate')}
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
