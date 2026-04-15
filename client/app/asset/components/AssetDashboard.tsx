'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { getAssetDashboard } from '@/lib/api/asset';
import type { AssetCategory, AssetDashboardResponse } from '@/types/asset';

// ─── 카테고리별 UI 매핑 ──────────────────────────────────────────
const CATEGORY_META: Record<AssetCategory, { label: string; color: string }> = {
  STOCK:     { label: '주식',  color: '#015E5F' },
  CASH:      { label: '계좌',  color: '#1EB1B2' },
  PENSION:   { label: '연금',  color: '#8DC8C8' },
  INSURANCE: { label: '보험',  color: '#C7E4E4' },
  CARD:      { label: '카드',  color: '#BDAE7F' },
};

// ─── 금액 포맷 (숫자 → "X억 Y만원") ────────────────────────────
function formatAmount(amount: number): string {
  const eok = Math.floor(amount / 100_000_000);
  const man = Math.floor((amount % 100_000_000) / 10_000);

  if (eok > 0 && man > 0) return `${eok}억 ${man.toLocaleString()}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${man.toLocaleString()}만원`;
}

// 파이차트 중앙 라벨용 축약형 ("12.4억")
function formatShort(amount: number): string {
  const eok = amount / 100_000_000;
  return `${eok.toFixed(1)}억`;
}

export function AssetDashboard() {
  const router = useRouter();
  const [data, setData] = useState<AssetDashboardResponse | null>(null);

  useEffect(() => {
    getAssetDashboard()
      .then(setData)
      .catch((err) => console.error('자산 대시보드 조회 실패:', err));
  }, []);

  // API 로딩 중에는 총액·차트 항목을 빈 값으로 렌더링
  const totalAmt = data ? formatAmount(data.totalFinancialAmt) : '불러오는 중...';
  const shortAmt = data ? formatShort(data.totalFinancialAmt) : '';

  const total = data
    ? data.financialAssets.reduce((sum, a) => sum + a.totalBalance, 0)
    : 0;

  const chartData = data
    ? data.financialAssets.map((a) => {
        const meta = CATEGORY_META[a.assetCateCd];
        return {
          name: meta.label,
          value: a.totalBalance,
          percentage: total > 0 ? (a.totalBalance / total) * 100 : 0,
          color: meta.color,
          displayValue: formatAmount(a.totalBalance),
        };
      })
    : [];

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push('/asset')}
      className="flex w-81.25 cursor-pointer flex-col overflow-hidden rounded-4xl shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
      style={{
        background: 'linear-gradient(135deg, #075558 0%, #0A9293 100%)',
      }}
    >
      <div className="p-6">
        <div className="space-y-1">
          <p className="font-medium text-[14px] text-white/80">내 총 금융 자산</p>
          <h3 className="font-bold text-[28px] text-white leading-tight tracking-tight">
            {totalAmt}
          </h3>
        </div>
      </div>

      <div className="mx-3 mb-3 flex flex-col rounded-4xl bg-white p-5 shadow-lg">
        <h4 className="mb-4 font-bold text-[13px] text-hana-black-800">자산 구성</h4>
        <div className="flex items-center gap-6">
          <div className="relative flex size-25 items-center justify-center">
            <ResponsiveContainer width={100} height={100}>
              <PieChart>
                <Pie
                  data={chartData.length > 0 ? chartData : [{ name: '-', value: 1, percentage: 100, color: '#E5E5E5', displayValue: '' }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={32}
                  outerRadius={46}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="percentage"
                  strokeWidth={0}
                >
                  {(chartData.length > 0 ? chartData : [{ color: '#E5E5E5' }]).map((item) => (
                    <Cell key={item.color} fill={item.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {shortAmt && (
              <div className="absolute flex flex-col items-center justify-center">
                <span className="font-bold text-[13px] text-hana-black-900">{shortAmt}</span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2.5">
            {chartData.map((asset) => (
              <div key={asset.name} className="space-y-1">
                <div className="flex items-center justify-between font-bold text-[11px] text-hana-black-800">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="size-1.5 rounded-full"
                      style={{ backgroundColor: asset.color }}
                    />
                    <span className="opacity-90">{asset.name}</span>
                  </div>
                  <span className="font-semibold">{asset.displayValue}</span>
                </div>
                <div className="h-[4.5px] w-full rounded-full bg-hana-silver-100">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${asset.percentage}%`,
                      backgroundColor: asset.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}