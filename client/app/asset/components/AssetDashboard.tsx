'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import type { AssetCategory, AssetDashboardResponse } from '../utils/types';
import { formatKoreanCurrency } from "@/app/asset/utils/formatCurrency";

const CATEGORY_META: Record<AssetCategory, { label: string; color: string }> = {
  STOCK:            { label: '주식',   color: '#015E5F' },
  CASH:             { label: '계좌',   color: '#1EB1B2' },
  PENSION:          { label: '연금',   color: '#8DC8C8' },
  PENSION_NATIONAL: { label: '국민연금', color: '#6BB8B9' },
  PENSION_RETIRE:   { label: '퇴직연금', color: '#4DA3A4' },
  PENSION_PERSONAL: { label: '개인연금', color: '#A8D8D8' },
  INSURANCE:        { label: '보험',   color: '#C7E4E4' },
  CARD:             { label: '카드',   color: '#BDAE7F' },
}

const DUMMY_CHART_DATA = [
  { name: '주식', percentage: 40, color: '#D1D5DB', displayValue: '??,???원' },
  { name: '계좌', percentage: 30, color: '#E5E7EB', displayValue: '??,???원' },
  { name: '연금', percentage: 20, color: '#9CA3AF', displayValue: '??,???원' },
  { name: '보험', percentage: 10, color: '#F3F4F6', displayValue: '??,???원' },
];

function formatShort(amount: number): string {
  return `${(amount / 100_000_000).toFixed(1)}억`;
}

interface Props {
  data: AssetDashboardResponse | null;
}

export function AssetDashboard({ data }: Props) {
  const router = useRouter();

  const isLinked = !!(data && data.isMyDataLinked);
  const labelText = isLinked ? "내 총 금융 자산" : "내 자산 한눈에 확인해볼까요?";
  const valueText = isLinked ? formatKoreanCurrency(data.totalFinancialAmt) : "마이데이터 연결하기";

  const total = data?.financialAssets.reduce((sum, a) => sum + a.totalBalance, 0) || 0;
  const chartData = data?.financialAssets.map((a) => {
    const meta = CATEGORY_META[a.assetCateCd];
    return {
      name: meta.label,
      value: a.totalBalance,
      percentage: total > 0 ? (a.totalBalance / total) * 100 : 0,
      color: meta.color,
      displayValue: formatKoreanCurrency(a.totalBalance),
    };
  }) || [];

  // 연동 여부에 따라 실제 데이터 또는 더미 데이터 선택
  const finalChartData = isLinked ? chartData : DUMMY_CHART_DATA;

  return (
      <motion.button
          type={"button"}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push(isLinked ? '/asset' : '/mydata/connect')}
          layout
          className="flex w-81.25 cursor-pointer flex-col overflow-hidden rounded-4xl text-left shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
          style={{ background: 'linear-gradient(135deg, #075558 0%, #0A9293 100%)' }}
      >
        <div className="p-6">
          <div className="space-y-1">
            <p className="font-medium text-[14px] text-white/80">{labelText}</p>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[28px] text-white leading-tight tracking-tight">
                {valueText}
              </h3>
              {!isLinked && <ChevronRight size={28} className="text-white/60" />}
            </div>
          </div>
        </div>

        <div className="mx-3 mb-3 flex flex-col rounded-4xl bg-white p-5 shadow-lg relative overflow-hidden">
          <h4 className="mb-4 font-bold text-[13px] text-hana-black-800">자산 구성</h4>

          <div className={`flex items-center gap-6 transition-all duration-500 ${!isLinked ? 'blur-md select-none' : ''}`}>
            <div className="relative flex size-25 items-center justify-center">
              <ResponsiveContainer width={100} height={100}>
                <PieChart>
                  <Pie
                      data={finalChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={32}
                      outerRadius={46}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="percentage"
                      strokeWidth={0}
                  >
                    {finalChartData.map((item, index) => (
                        <Cell key={`cell-${index}`} fill={item.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center">
              <span className="font-bold text-[13px] text-hana-black-900">
                {isLinked ? formatShort(data.totalFinancialAmt) : "??억"}
              </span>
              </div>
            </div>

            <div className="flex-1 space-y-2.5">
              {finalChartData.map((asset, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between font-bold text-[11px] text-hana-black-800">
                      <div className="flex items-center gap-1.5">
                        <div className="size-1.5 rounded-full" style={{ backgroundColor: asset.color }} />
                        <span className="opacity-90">{asset.name}</span>
                      </div>
                      <span className="font-semibold">{isLinked ? asset.displayValue : "??,???원"}</span>
                    </div>
                    <div className="h-[4.5px] w-full rounded-full bg-hana-silver-100">
                      <div
                          className="h-full rounded-full"
                          style={{ width: `${asset.percentage}%`, backgroundColor: asset.color }}
                      />
                    </div>
                  </div>
              ))}
            </div>
          </div>

          {!isLinked && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 z-10">
                <div className="flex size-11 items-center justify-center rounded-full bg-white shadow-md mb-2">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <p className="text-[14px] text-hana-black-800 font-bold">연동 후 확인 가능해요</p>
              </div>
          )}
        </div>
      </motion.button>
  );
}
