'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import Header from '@/components/navigation/Header';
import { NavigationBar } from '@/components/navigation/NavigationBar';

// 연도별 입금 내역 데이터
const yearlyDepositData: Record<string, any[]> = {
  '2026년': [
    {
      date: '2026. 04. 26.',
      type: '정기지급',
      amount: '300만원',
      total: '1억 800만원',
    },
    {
      date: '2026. 03. 26.',
      type: '정기지급',
      amount: '300만원',
      total: '1억 500만원',
    },
    {
      date: '2026. 02. 26.',
      type: '정기지급',
      amount: '300만원',
      total: '1억 200만원',
    },
  ],
  '2025년': [
    {
      date: '2025. 12. 26.',
      type: '정기지급',
      amount: '300만원',
      total: '9,900만원',
    },
    {
      date: '2025. 11. 26.',
      type: '정기지급',
      amount: '300만원',
      total: '9,600만원',
    },
    {
      date: '2025. 10. 26.',
      type: '정기지급',
      amount: '300만원',
      total: '9,300만원',
    },
  ],
  '2024년': [
    {
      date: '2024. 12. 26.',
      type: '정기지급',
      amount: '300만원',
      total: '3,600만원',
    },
    {
      date: '2024. 11. 26.',
      type: '정기지급',
      amount: '300만원',
      total: '3,300만원',
    },
  ],
};

// 그래프 데이터 (1년~20년)
const chartData = [
  { year: '1년', value: 360 },
  { year: '5년', value: 1800 },
  { year: '10년', value: 3600 },
  { year: '15년', value: 5400 },
  { year: '20년', value: 7200 },
];

export default function HomePensionDashboard() {
  const years = useMemo(
    () => Object.keys(yearlyDepositData).sort().reverse(),
    [],
  );
  const [currentYearIdx, setCurrentYearIdx] = useState(0);
  const currentYear = years[currentYearIdx];
  const currentHistory = yearlyDepositData[currentYear];

  const handlePrevYear = () => {
    if (currentYearIdx < years.length - 1)
      setCurrentYearIdx(currentYearIdx + 1);
  };

  const handleNextYear = () => {
    if (currentYearIdx > 0) setCurrentYearIdx(currentYearIdx - 1);
  };

  return (
    <div className="app-shell bg-white">
      <div className="app-layout bg-white">
        <Header title="주택연금 운용 현황" showBackButton />

        <main className="app-main no-scrollbar px-5 pt-6 pb-24">
          <section className="mb-8">
            <p className="text-[#6B7280] text-[15px] font-medium ml-0.5">
              이달의 수령액
            </p>
            <h1 className="text-[34px] font-black text-[#111827] tracking-tight mt-1">
              300만원
            </h1>

            <div className="flex gap-4 mt-3 text-[16px] font-semibold text-[#6B7280] ml-0.5">
              <span>
                수령 방식 · <span className="text-[#1098A0]">정액형</span>
              </span>
              <span>
                누적 수령 · <span className="text-[#EF4444]">3,600만원</span>
              </span>
            </div>
          </section>

          {/* 누적 수령액 그래프 */}
          <section className="rounded-[28px] border border-[#F3F4F6] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-9">
            <div className="flex justify-between items-center mb-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-[18px] font-bold text-[#111827]">
                  예상 누적 수령액
                </h3>
                <p className="text-[14px] text-[#1098A0] font-semibold">
                  20년 뒤 <span className="text-[15px] font-bold">7.2억</span>{' '}
                  예상
                </p>
              </div>
            </div>

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ left: -15, right: 10 }}>
                  <defs>
                    <linearGradient
                      id="pensionGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#1098A0"
                        stopOpacity={0.25}
                      />
                      <stop offset="95%" stopColor="#1098A0" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F1F5F9"
                  />
                  <XAxis
                    dataKey="year"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF', fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF', fontWeight: 600 }}
                    tickFormatter={(value) => `${value / 1000}억`}
                  />
                  <Tooltip content={() => null} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#1098A0"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#pensionGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* 입금 내역 섹션 (연도 선택) */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5 px-1">
              <h3 className="text-[19px] font-bold text-[#111827]">
                입금 내역
              </h3>

              <div className="flex items-center gap-4 bg-[#F9FAFB] px-3 py-1.5 rounded-full border border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={handlePrevYear}
                  disabled={currentYearIdx === years.length - 1}
                  aria-label="이전 연도로 이동"
                  className={`text-[#9CA3AF] p-1 transition-opacity ${
                    currentYearIdx === years.length - 1
                      ? 'opacity-30 cursor-not-allowed'
                      : 'opacity-100 hover:text-[#374151]'
                  }`}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>

                <span
                  className="text-[14px] font-bold text-[#374151] min-w-[60px] text-center"
                  aria-live="polite"
                >
                  {currentYear}
                </span>

                <button
                  type="button"
                  onClick={handleNextYear}
                  disabled={currentYearIdx === 0}
                  aria-label="다음 연도로 이동"
                  className={`text-[#9CA3AF] p-1 transition-opacity ${
                    currentYearIdx === 0
                      ? 'opacity-30 cursor-not-allowed'
                      : 'opacity-100 hover:text-[#374151]'
                  }`}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentYear}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className="py-6 border-b border-[#F3F4F6] last:border-0 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-[#9CA3AF] text-[14px] font-medium mb-1.5">
                          {item.date}
                        </p>
                        <p className="text-[#111827] font-bold text-[17px]">
                          {item.type}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#111827] font-black text-[19px]">
                          {item.amount}
                        </p>
                        <p className="text-[#9CA3AF] text-[14px] mt-1.5 font-semibold">
                          잔액 · {item.total}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </section>

          <div className="mt-2 mb-8">
            <PrimaryButton label="상담 신청하기" onClick={() => {}} />
          </div>
        </main>
      </div>
      <NavigationBar />
    </div>
  );
}
