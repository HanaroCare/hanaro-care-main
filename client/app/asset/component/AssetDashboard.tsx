/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';
import { useState } from 'react';

const ASSET_DATA = [
  { name: '주식', value: '5억 2,000만', percentage: 74.5, color: '#015E5F' },
  { name: '적금', value: '1억 2,000만', percentage: 63.1, color: '#1EB1B2' },
  { name: '펀드', value: '3,000만', percentage: 50.6, color: '#8DC8C8' },
  { name: '연금', value: '2,000만', percentage: 36.4, color: '#C7E4E4' },
  { name: '계좌', value: '1,000만', percentage: 13.1, color: '#BDAE7F' },
];

export function AssetDashboard() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col items-center p-4">
      <motion.div
        layout // 레이아웃 변경 시 애니메이션 자동 적용
        onClick={() => !isExpanded && setIsExpanded(true)}
        className={`relative flex cursor-pointer flex-col overflow-hidden rounded-4xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] ${
          isExpanded ? 'h-[400px] w-[325px]' : 'h-31.5 w-81.25'
        }`}
        style={{
          background: 'linear-gradient(135deg, #075558 0%, #0A9293 100%)',
        }}
      >
        {/* 닫기 버튼 (확장되었을 때만 표시) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
                setIsExpanded(false);
              }}
              className="absolute top-4 right-4 z-50 flex size-6 items-center justify-center rounded-full bg-white/20 text-white outline-none hover:bg-white/30"
            >
              <X size={16} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* 요약/상세 공통 상단 섹션 */}
        <div className="p-6">
          <div className="relative">
            {!isExpanded && (
              <div className="-translate-y-1/2 absolute top-1/2 right-0">
                <ChevronRight size={24} className="text-white/40" />
              </div>
            )}
            <div className="space-y-1">
              <p className="font-medium text-[14px] text-white/80">
                내 총 금융 자산
              </p>
              <motion.h3
                layout="position"
                className="font-bold text-[28px] text-white leading-tight tracking-tight"
              >
                12억 4,830만원
              </motion.h3>
            </div>

            <div className="mt-2 inline-flex h-6 items-center rounded-full bg-white px-3">
              <span className="flex items-center gap-1 font-bold text-[#D60003] text-[11px]">
                230만 ( 1.2% )
                <svg
                  width="6"
                  height="4"
                  viewBox="0 0 6 4"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M3 0L6 4L0 4L3 0Z" fill="#D60003" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* 상세 정보 섹션 (확장 시에만 나타남) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mx-3 mt-auto mb-3 flex flex-col rounded-[20px] bg-white p-5 shadow-lg"
            >
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-bold text-[#3E454C] text-[13px]">
                  자산 구성
                </h4>
              </div>

              <div className="flex items-center gap-6">
                {/* Donut Chart */}
                <div className="relative flex size-[100px] items-center justify-center">
                  <svg className="size-full" viewBox="0 0 100 100">
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
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="font-bold text-[#070707] text-[13px]">
                      12.4억
                    </span>
                  </div>
                </div>

                {/* Breakdown List */}
                <div className="flex-1 space-y-2.5">
                  {ASSET_DATA.map((asset) => (
                    <div key={asset.name} className="space-y-1">
                      <div className="flex items-center justify-between font-bold text-[#3E454C] text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="size-1.5 rounded-full"
                            style={{ backgroundColor: asset.color }}
                          />
                          <span className="opacity-90">{asset.name}</span>
                        </div>
                        <span className="font-semibold">{asset.value}</span>
                      </div>
                      <div className="h-[4.5px] w-full rounded-full bg-[#F1F3F5]">
                        <div
                          className="h-full rounded-full bg-current transition-all duration-1000"
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
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
