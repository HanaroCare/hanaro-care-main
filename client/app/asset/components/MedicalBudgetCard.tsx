'use client';

import { motion } from 'framer-motion';
import type { SimulationSummaryResponse } from '../actions/asset';

type Props = {
  data: SimulationSummaryResponse | null;
  totalFinancialAmt: number;
};

function toEok(won: number): number {
  return Math.round((won / 100_000_000) * 10) / 10;
}

export function MedicalBudgetCard({ data, totalFinancialAmt }: Props) {
  if (!data) return null;

  const medicalEok = toEok(data.medicalCost);
  const financialEok = toEok(totalFinancialAmt);

  const hasFinancialAssets = totalFinancialAmt > 0;

  const usagePercent =
      hasFinancialAssets
      ? Math.min(100, Math.round((data.medicalCost / totalFinancialAmt) * 100))
      : 0;

  // 자산 고갈까지 몇 년: 현재 금융 자산 / (월 부족액 × 12)
  const yearsUntilDepletion =
      hasFinancialAssets && !data.isSufficient && data.shortageAmt > 0
      ? Math.floor(totalFinancialAmt / (data.shortageAmt * 12))
      : null;

  return (
    <div className="w-81.25 rounded-4xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[15px] text-hana-black-900">
          나의 의료비 예산
        </h3>
        <div className="flex items-baseline gap-1">
          <span className="font-bold text-[16px] text-hana-black-900">
            {medicalEok}억
          </span>
          <span className="font-medium text-[10px] text-hana-black-400">
            / {financialEok}억
          </span>
        </div>
      </div>

      <div className="mt-4 h-2.75 w-full overflow-hidden rounded-full bg-hana-silver-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${usagePercent}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #2D4F50 0%, #66B5B6 100%)' }}
        />
      </div>

      <div className="mt-4 flex flex-col gap-1">
        {yearsUntilDepletion !== null ? (
            <p className="font-medium text-[15px] text-hana-black-600">
                        {hasFinancialAssets
                       ? `현재 금융 자산의 ${usagePercent}% 사용`
                           : '현재 연결된 금융 자산이 없어요'}
                      </p>
        ) : (
          <p className="font-medium text-[12px] text-hana-green-700">
            수입으로 모두 충당 가능해요
          </p>
        )}
      </div>
    </div>
  );
}
