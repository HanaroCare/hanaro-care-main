import { notFound } from 'next/navigation';
import Header from '@/components/navigation/Header';
import { insuranceDetails, viewMode } from '../constants/data';
import InsuranceLogo from '../constants/InsuranceLogo';

const DETAIL_ROWS = [
  { label: '보험 종류', key: 'type', colored: false },
  { label: '월 보험료', key: 'monthlyPremium', colored: false },
  { label: '계약일', key: 'contractDate', colored: true },
  { label: '만기일', key: 'expiryDate', colored: true },
] as const;

export default async function InsuranceDetailPage({
  params,
}: {
  params: Promise<{ insuranceId: string }>;
}) {
  const { insuranceId } = await params;

  const detail = insuranceDetails.find(
    (item) => item.id === Number(insuranceId),
  );

  if (!detail) {
    notFound();
  }
  const getValue = (key: (typeof DETAIL_ROWS)[number]['key']) => {
    const val = detail[key];
    return val ?? '-';
  };
  return (
    <div className="-mx-6.25 min-h-full bg-gray-50 px-6.25 pt-2 pb-83">
      <div className="mt-12 mb-5 rounded-2xl bg-white p-5 py-7 shadow-sm">
        <div className="flex items-center gap-3">
          <InsuranceLogo />
          <div>
            <p className="font-bold text-[17px] text-gray-900">
              {detail.company}
            </p>
            <p className="my-1 text-gray-500 text-sm">{detail.name}</p>
          </div>
        </div>
        {viewMode === 'GRANTEE' && (
          <p className="mt-2 mb-8 ml-0.5 font-medium text-hana-ez-600 text-xs">
            parent님의 보험
          </p>
        )}

        <div className="mt-4 border-2 border-gray-100" />

        {/* 상세 정보 */}
        <div className="mt-4 space-y-4">
          {DETAIL_ROWS.map(({ label, key, colored }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">{label}</span>
              <span
                className={`font-medium text-sm ${
                  colored ? 'text-teal-600' : 'text-gray-900'
                }`}
              >
                {getValue(key)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
