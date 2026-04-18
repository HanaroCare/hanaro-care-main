'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  getPayoutHistory,
  getPensionStatus,
  type PensionPayoutHistoryResponse,
  type PensionStatusResponse,
} from '@/app/asset/actions/pension';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import Header from '@/components/navigation/Header';
import { NavigationBar } from '@/components/navigation/NavigationBar';
import { handleReservation } from '@/lib/utils';
import { formatKoreanCurrency } from '../../utils/formatCurrency';

function formatHistoryDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return '-';

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}. ${month}. ${day}.`;
}

export default function HomePensionDashboard() {
  const [status, setStatus] = useState<PensionStatusResponse | null>(null);
  const [historyData, setHistoryData] =
    useState<PensionPayoutHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentYearIdx, setCurrentYearIdx] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const [statusRes, historyRes] = await Promise.all([
          getPensionStatus(),
          getPayoutHistory(),
        ]);

        setStatus(statusRes);
        setHistoryData(historyRes);
      } catch (error) {
        console.error('주택연금 운용 현황 조회 실패', error);
        setErrorMessage('주택연금 운용 현황을 불러오지 못했어요.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = useMemo(() => {
    if (!status?.chartPoints?.length) return [];

    return status.chartPoints.map((item) => ({
      year: `${item.year}년`,
      value: Number((item.cumulativeAmount / 100_000_000).toFixed(1)),
    }));
  }, [status]);

  const historyWithTotal = useMemo(() => {
    if (!historyData?.history?.length) return [];

    const oldestFirst = [...historyData.history].sort(
      (a, b) =>
        new Date(a.payoutDate).getTime() - new Date(b.payoutDate).getTime(),
    );

    let cumulative = 0;

    const withTotal = oldestFirst.map((item) => {
      cumulative += item.amount;

      return {
        ...item,
        total: cumulative,
        year: `${new Date(item.payoutDate).getFullYear()}년`,
      };
    });

    return withTotal.sort(
      (a, b) =>
        new Date(b.payoutDate).getTime() - new Date(a.payoutDate).getTime(),
    );
  }, [historyData]);

  const years = useMemo(() => {
    return Array.from(new Set(historyWithTotal.map((item) => item.year))).sort(
      (a, b) => Number(b.replace('년', '')) - Number(a.replace('년', '')),
    );
  }, [historyWithTotal]);

  useEffect(() => {
    setCurrentYearIdx(0);
  }, [years]);

  const currentYear = years[currentYearIdx];

  const currentHistory = useMemo(() => {
    if (!currentYear) return [];
    return historyWithTotal.filter((item) => item.year === currentYear);
  }, [historyWithTotal, currentYear]);

  const handlePrevYear = () => {
    if (currentYearIdx < years.length - 1) {
      setCurrentYearIdx((prev) => prev + 1);
    }
  };

  const handleNextYear = () => {
    if (currentYearIdx > 0) {
      setCurrentYearIdx((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="app-shell bg-white">
        <div className="app-layout bg-white">
          <Header title="주택연금 운용 현황" showBackButton />
          <main className="app-main px-5 pt-6">
            <p className="text-[14px] text-[#9CA3AF]">불러오는 중...</p>
          </main>
        </div>
        <NavigationBar />
      </div>
    );
  }

  if (!status) {
    return (
      <div className="app-shell bg-white">
        <div className="app-layout bg-white">
          <Header title="주택연금 운용 현황" showBackButton />
          <main className="app-main px-5 pt-6">
            <p className="text-[14px] text-[#EF4444]">
              {errorMessage ?? '주택연금 운용 현황이 없어요.'}
            </p>
          </main>
        </div>
        <NavigationBar />
      </div>
    );
  }

  return (
    <div className="app-shell bg-white">
      <div className="app-layout bg-white">
        <Header title="주택연금 운용 현황" showBackButton />

        <main className="app-main no-scrollbar px-5 pt-6 pb-24">
          <section className="mb-8">
            <p className="ml-0.5 text-[15px] font-medium text-[#6B7280]">
              이달의 수령액
            </p>
            <h1 className="mt-1 text-[34px] font-black tracking-tight text-[#111827]">
              {formatKoreanCurrency(status.currentMonthlyPayout)}
            </h1>

            <div className="ml-0.5 mt-3 flex gap-4 text-[16px] font-semibold text-[#6B7280]">
              <span>
                수령 방식 ·{' '}
                <span className="text-[#1098A0]">
                  {status.pensionPayoutLabel}
                </span>
              </span>
              <span>
                누적 수령 ·{' '}
                <span className="text-[#EF4444]">
                  {formatKoreanCurrency(status.currentCumulativeAmount)}
                </span>
              </span>
            </div>
          </section>

          <section className="mb-9 rounded-[28px] border border-[#F3F4F6] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="text-[18px] font-bold text-[#111827]">
                  예상 누적 수령액
                </h3>
                <p className="text-[14px] font-semibold text-[#1098A0]">
                  {chartData.length > 0 ? (
                    <>
                      {chartData[chartData.length - 1].year}{' '}
                      <span className="text-[15px] font-bold">
                        {chartData[chartData.length - 1].value}억
                      </span>{' '}
                      예상
                    </>
                  ) : (
                    '예상 데이터 없음'
                  )}
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
                    tickFormatter={(value) => `${value}억`}
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

          <section className="mb-10">
            <div className="mb-5 flex items-center justify-between px-1">
              <h3 className="text-[19px] font-bold text-[#111827]">
                입금 내역
              </h3>

              <div className="flex items-center gap-4 rounded-full border border-[#F1F5F9] bg-[#F9FAFB] px-3 py-1.5">
                <button
                  type="button"
                  onClick={handlePrevYear}
                  disabled={currentYearIdx === years.length - 1}
                  className={`p-1 text-[#9CA3AF] ${
                    currentYearIdx === years.length - 1
                      ? 'opacity-30'
                      : 'hover:text-[#374151]'
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="m15 18-6-6 6-6"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <span className="min-w-[60px] text-center text-[14px] font-bold text-[#374151]">
                  {currentYear ?? '-'}
                </span>

                <button
                  type="button"
                  onClick={handleNextYear}
                  disabled={currentYearIdx === 0}
                  className={`p-1 text-[#9CA3AF] ${
                    currentYearIdx === 0 ? 'opacity-30' : 'hover:text-[#374151]'
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="m9 18 6-6-6-6"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
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
                  {currentHistory.length > 0 ? (
                    currentHistory.map((item, idx) => (
                      <div
                        key={`${item.payoutDate}-${idx}`}
                        className="flex items-center justify-between border-b border-[#F3F4F6] py-6 last:border-0"
                      >
                        <div>
                          <p className="mb-1.5 text-[14px] font-medium text-[#9CA3AF]">
                            {formatHistoryDate(item.payoutDate)}
                          </p>
                          <p className="text-[17px] font-bold text-[#111827]">
                            정기지급
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-[19px] font-black text-[#111827]">
                            {formatKoreanCurrency(item.amount)}
                          </p>
                          <p className="mt-1.5 text-[14px] font-semibold text-[#9CA3AF]">
                            누적 수령 · {formatKoreanCurrency(item.total)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : historyData?.nextPayoutDate ? (
                    <div className="flex items-center justify-between rounded-[20px] border border-dashed border-[#CCFBF1] bg-[#F0FDFD] px-6 py-6">
                      <div>
                        <p className="mb-1 text-[13px] font-medium text-[#9CA3AF]">
                          첫 입금 예정일
                        </p>
                        <p className="text-[17px] font-bold text-[#111827]">
                          {formatHistoryDate(historyData.nextPayoutDate)}
                        </p>
                      </div>
                      {historyData.nextPayoutAmount != null && (
                        <p className="text-[19px] font-black text-[#1098A0]">
                          {formatKoreanCurrency(historyData.nextPayoutAmount)}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="py-8 text-center text-[14px] text-[#9CA3AF]">
                      표시할 입금 내역이 없어요.
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </section>

          <div className="mb-8 mt-2">
            <PrimaryButton label="상담 신청하기" onClick={handleReservation} />
          </div>
        </main>
      </div>

      <NavigationBar />
    </div>
  );
}
