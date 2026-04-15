'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

type IncomeDetail = {
  national: number;
  retirement: number;
  subsidy: number;
};

type AgeSegmentItem = {
  range: string;
  income: number;
  income_detail?: IncomeDetail;
  expense: number;
  detail: {
    living: number;
    medical: number;
    care: number;
  };
};

type SimulationExpenseAccordionProps = {
  items: AgeSegmentItem[];
};

export function SimulationExpenseAccordion({ items }: SimulationExpenseAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const segmentItems = items.map(seg => {
    const living = Math.floor(Number(seg.detail.living) / 10000);
    const medical = Math.floor(Number(seg.detail.medical) / 10000);
    const care = Math.floor(Number(seg.detail.care) / 10000);
    const maxExpense = Math.max(living, medical, care) || 1;

    const national = Math.floor(Number(seg.income_detail?.national ?? 0) / 10000);
    const retirement = Math.floor(Number(seg.income_detail?.retirement ?? 0) / 10000);
    const subsidy = Math.floor(Number(seg.income_detail?.subsidy ?? 0) / 10000);
    const totalIncome = Math.floor(Number(seg.income) / 10000);
    const maxIncome = Math.max(national, retirement, subsidy) || 1;

    return {
      range: seg.range,
      totalIncome,
      totalExpense: Math.floor(Number(seg.expense) / 10000),
      incomeBreakdown: [
        { label: '국민연금', amount: `${national}만원`, progress: national / maxIncome, color: 'var(--color-hana-green-600)' },
        { label: '퇴직연금', amount: `${retirement}만원`, progress: retirement / maxIncome, color: 'var(--color-hana-green-400)' },
        { label: '지자체 지원', amount: `${subsidy}만원`, progress: subsidy / maxIncome, color: 'var(--color-hana-teal-400)' },
      ],
      expenseBreakdown: [
        { label: '생활비', amount: `${living}만원`, progress: living / maxExpense, color: 'var(--color-hana-ez-600)' },
        { label: '병원비', amount: `${medical}만원`, progress: medical / maxExpense, color: 'var(--color-hana-blue-500)' },
        { label: '요양비', amount: `${care}만원`, progress: care / maxExpense, color: 'var(--color-hana-teal-500)' },
      ],
    };
  });

  return (
    <div className="flex w-full flex-col gap-4">
      {segmentItems.map((item, index) => {
        const gap = item.totalIncome - item.totalExpense;
        const isSufficient = gap >= 0;

        return (
          <div
            key={item.range}
            className="overflow-hidden rounded-[20px] border border-hana-silver-100 bg-white shadow-sm"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between px-6 py-[22px] transition-colors active:bg-hana-silver-50"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-medium text-[17px] text-hana-black-500">
                {item.range}
              </span>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end gap-0.5">
                  <span className="font-bold text-[15px] text-hana-green-700">
                    수입 {item.totalIncome.toLocaleString()}만원
                  </span>
                  <span className="font-bold text-[15px] text-hana-red-500">
                    지출 {item.totalExpense.toLocaleString()}만원
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={22} className="text-hana-silver-200" />
                </motion.div>
              </div>
            </button>

            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="flex flex-col gap-8 border-t border-hana-silver-100 px-6 py-8">

                    {/* 수입 섹션 */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[14px] text-hana-black-500 uppercase tracking-wide">
                          수입
                        </span>
                        <span className="font-bold text-[15px] text-hana-green-700">
                          월 {item.totalIncome.toLocaleString()}만원
                        </span>
                      </div>
                      {item.incomeBreakdown.map((b) => (
                        <div key={b.label} className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-[14px] text-hana-black-500">{b.label}</span>
                            <span className="font-semibold text-[15px] text-hana-green-700">{b.amount}</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-hana-silver-100">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${b.progress * 100}%` }}
                              transition={{ duration: 0.8, delay: 0.05 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: b.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="h-px w-full bg-hana-silver-100" />

                    {/* 지출 섹션 */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[14px] text-hana-black-500 uppercase tracking-wide">
                          지출
                        </span>
                        <span className="font-bold text-[15px] text-hana-red-500">
                          월 {item.totalExpense.toLocaleString()}만원
                        </span>
                      </div>
                      {item.expenseBreakdown.map((b) => (
                        <div key={b.label} className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-[14px] text-hana-black-500">{b.label}</span>
                            <span className="font-bold text-[15px] text-hana-red-500">{b.amount}</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-hana-silver-100">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${b.progress * 100}%` }}
                              transition={{ duration: 0.8, delay: 0.1 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: b.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 구간 소결 */}
                    <div className={`flex items-center justify-between rounded-[14px] px-5 py-4 ${isSufficient ? 'bg-hana-green-50' : 'bg-hana-red-50'}`}>
                      <span className="font-medium text-[14px] text-hana-black-500">이 시기 월 평균</span>
                      <span className={`font-bold text-[17px] ${isSufficient ? 'text-hana-green-700' : 'text-hana-red-500'}`}>
                        {isSufficient
                          ? `${Math.abs(gap).toLocaleString()}만원 여유`
                          : `${Math.abs(gap).toLocaleString()}만원 부족`}
                      </span>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
