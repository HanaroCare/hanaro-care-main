'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import PrimaryButton from '@/components/PrimaryButton';
import SubHeader from '@/components/SubHeader';

function CompareBar({
  label,
  value,
  textClassName,
  barClassName,
  widthClass,
  delay = 0,
}: {
  label: string;
  value: string;
  textClassName: string;
  barClassName: string;
  widthClass: string;
  delay?: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[15px] leading-6 font-medium text-[#1F2937]">
          {label}
        </span>
        <span
          className={`text-[15px] leading-6 font-semibold tracking-tight ${textClassName}`}
        >
          {value}
        </span>
      </div>

      <div className="h-3 w-full rounded-full bg-[#E5E7EB]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.9, delay, ease: 'easeOut' }}
          className={`h-3 rounded-full ${barClassName} ${widthClass}`}
        />
      </div>
    </div>
  );
}

function InfoCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[24px] border border-[#E5E7EB] bg-white px-7 py-7 shadow-[0_2px_10px_rgba(0,0,0,0.03)] ${className}`}
    >
      {children}
    </div>
  );
}

function Row({
  label,
  value,
  valueClassName = 'text-[#1F2937]',
  labelClassName = 'text-[#6B7280]',
  className = '',
}: {
  label: string;
  value: string;
  valueClassName?: string;
  labelClassName?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <span
        className={`text-[16px] leading-6 font-medium tracking-tight ${labelClassName}`}
      >
        {label}
      </span>
      <span
        className={`text-[18px] leading-7 font-bold tracking-tight ${valueClassName}`}
      >
        {value}
      </span>
    </div>
  );
}

export default function CompareSellVsPensionPage() {
  const router = useRouter();

  return (
    <div className="app-shell bg-white">
      <div className="app-layout bg-white">
        <SubHeader
          title="주택연금 vs 매도"
          backUrl="/asset/home-pension/predict"
          closeUrl="/asset"
        />
        <main className="app-main no-scrollbar px-6 pt-10 pb-8">
          <section>
            <h2 className="text-[22px] leading-8 font-bold tracking-tight text-[#1F2937]">
              20년 기준 총액 비교
            </h2>

            <div className="mt-8 space-y-7">
              <CompareBar
                label="주택연금"
                value="4억 7,520만"
                textClassName="text-[#53C4CC]"
                barClassName="bg-[#53C4CC]"
                widthClass="max-w-[51%]"
                delay={0.1}
              />

              <CompareBar
                label="매도"
                value="약 10억 5,800만"
                textClassName="text-[#B5A36D]"
                barClassName="bg-[#B5A36D]"
                widthClass="max-w-[88%]"
                delay={0.25}
              />
            </div>

            <div className="mt-10">
              <h3 className="text-[18px] leading-7 font-bold tracking-tight text-[#1F2937]">
                설계값 가격 시
              </h3>

              <InfoCard className="mt-5">
                <Row
                  label="월 수령액"
                  value="198만원"
                  valueClassName="text-[#1F2937] text-[24px] leading-8"
                />
                <div className="my-6 h-px bg-[#E5E7EB]" />
                <Row
                  label="20년 총 수령액"
                  value="4억 752만원"
                  valueClassName="text-[#1F2937]"
                />
              </InfoCard>
            </div>

            <div className="mt-8">
              <h3 className="text-[18px] leading-7 font-bold tracking-tight text-[#1F2937]">
                매도 시
              </h3>

              <InfoCard className="mt-5">
                <Row
                  label="10년 후 매도가"
                  value="11.2억"
                  valueClassName="text-[#1F2937] text-[24px] leading-8"
                />
                <div className="my-6 h-px bg-[#E5E7EB]" />
                <Row
                  label="예상 세금"
                  value="-8,400만"
                  valueClassName="text-hana-red-500"
                  labelClassName="text-[#6B7280]"
                />
                <Row
                  label="실현 예상"
                  value="10억 3,600만"
                  valueClassName="text-[#1F2937]"
                  className="mt-5"
                />
              </InfoCard>
            </div>
          </section>
        </main>

        <footer className="shrink-0 bg-white px-6 py-4">
          <PrimaryButton
            label="주택 연금 시뮬레이션"
            className="h-14 rounded-2xl text-[16px] leading-6"
            onClick={() => {
              router.push('/asset/home-pension/result');
            }}
          />
        </footer>
      </div>
    </div>
  );
}
