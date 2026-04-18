'use client';

import InsuranceLogo from '../components/InsuranceLogo';
import type { InsuranceDetailDto } from '../types';

const DETAIL_ROWS = [
  { label: '보험사', key: 'instNm', isNested: true },
  { label: '월 보험료', key: 'monthlyPremAmt', isNested: true },
  { label: '계약일', key: 'contrDt', isNested: false },
  { label: '만기일', key: 'expireDt', isNested: false },
] as const;

interface InsuranceDetailViewProps {
  detail: InsuranceDetailDto;
}
export default function InsuranceDetail({ detail }: InsuranceDetailViewProps) {
  const getValue = (row: (typeof DETAIL_ROWS)[number]) => {
    if (row.isNested) {
      const val = (detail.insuranceDto as any)[row.key];
      if (row.key === 'monthlyPremAmt') return `${val?.toLocaleString()}원`;
      return val ?? '-';
    } else {
      return (detail as any)[row.key] ?? '-';
    }
  };
  console.log(detail)
  return (
    <div className="-mx-6.25 min-h-full bg-gray-50 px-6.25 pt-2 pb-83">
      <div className="mt-12 mb-5 rounded-2xl bg-white p-5 py-7 shadow-sm">
        <div className="flex items-center gap-3">
          <InsuranceLogo img={detail.insuranceDto.instNm} />
          <div>
            <p className="font-bold text-[17px] text-gray-900">
              {detail.insuranceDto.instNm}
            </p>
            <p className="my-1 text-gray-500 text-sm">
              {detail.insuranceDto.accountNm}
            </p>
          </div>
        </div>
        <p className="mt-2 mb-8 ml-0.5 font-medium text-hana-ez-600 text-xs">
            {detail.insuranceDto.username} 님의 보험
          </p>

        <div className="mt-4 border-gray-100 border-b" />

        <div className="mt-4 space-y-4">
          {DETAIL_ROWS.map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">{row.label}</span>
              <span className="font-medium text-gray-900 text-sm">
                {getValue(row)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
