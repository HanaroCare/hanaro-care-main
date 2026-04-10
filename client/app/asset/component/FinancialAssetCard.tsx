/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
'use client';

import { motion } from 'framer-motion';

const ASSET_DATA = [
  { name: '주식', value: '5억 2,000만', percentage: 74.5, color: '#015E5F' },
  { name: '적금', value: '1억 2,000만', percentage: 63.1, color: '#1EB1B2' },
  { name: '펀드', value: '3,000만', percentage: 50.6, color: '#8DC8C8' },
  { name: '연금', value: '2,000만', percentage: 36.4, color: '#C7E4E4' },
  { name: '계좌', value: '1,000만', percentage: 13.1, color: '#BDAE7F' },
];

export function FinancialAssetCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex h-[400px] w-[325px] flex-col overflow-hidden rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
      style={{
        background:
          'linear-gradient(145deg, rgba(7, 85, 87, 0.8) 0%, rgba(10, 146, 147, 0.8) 100%)',
      }}
    >
      {/* Top Section - Teal Background Area */}
      <div className="p-6 pb-4">
        <div className="-space-y-0.5">
          <p className="font-medium text-[14px] text-white/80">
            내 총 금융 자산
          </p>
          <h3 className="font-bold text-[28px] text-white tracking-tight">
            12억 4,830만원
          </h3>
        </div>

        <div className="mt-2 inline-flex h-[24px] items-center rounded-full bg-white px-3">
          <span className="flex items-center gap-1 font-bold text-[#D60003] text-[11px]">
            230만 ( 1.2% )
            <svg
              width="6"
              height="4"
              viewBox="0 0 6 4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 0L6 4L0 4L3 0Z" fill="#D60003" />
            </svg>
          </span>
        </div>
      </div>

      <div className="mx-3 mt-auto mb-3 flex flex-col rounded-[20px] bg-white p-5 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="font-bold text-[#3E454C] text-[13px]">자산 구성</h4>
        </div>

        <div className="flex items-center gap-6">
          {/* Thick Donut Chart */}
          <div className="relative flex h-[100px] w-[100px] items-center justify-center">
            <svg className="h-full w-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#F8F9FA"
                strokeWidth="18"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#015E5F"
                strokeWidth="18"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 * (1 - 0.745)}
                transform="rotate(-90 50 50)"
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#1EB1B2"
                strokeWidth="18"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 * (1 - 0.45)}
                transform="rotate(-15 50 50)"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-bold text-[#070707] text-[13px]">
                12.4억
              </span>
            </div>
          </div>

          {/* Asset Breakdown List - Increased Text Size */}
          <div className="flex-1 space-y-2.5">
            {ASSET_DATA.map((asset) => (
              <div key={asset.name} className="space-y-1">
                <div className="flex items-center justify-between font-bold text-[#3E454C] text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="h-[6px] w-[6px] rounded-full"
                      style={{ backgroundColor: asset.color }}
                    />
                    <span className="opacity-90">{asset.name}</span>
                  </div>
                  <span className="font-semibold">{asset.value}</span>
                </div>
                <div className="h-[4.5px] w-full rounded-full bg-[#F1F3F5]">
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
