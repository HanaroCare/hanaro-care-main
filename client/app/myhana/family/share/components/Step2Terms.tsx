'use client';

import React, { useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import { Check } from 'lucide-react';

export default function Step2Terms({ onNext }: { onNext: () => void }) {
  const [allAgreed, setAllAgreed] = useState(false);

  return (
    <div className="flex flex-col flex-1 px-6 py-10">
      <h2 className="text-[22px] font-bold mb-3 leading-[1.45] tracking-tight text-[#1A1A1A]">
        서비스 이용을 위해<br />동의가 필요해요
      </h2>
      <p className="text-[12px] text-[#6A7282] mb-10">
        아래 항목을 확인하고 동의해주세요
      </p>

      <div className="flex-1 space-y-6">
        <button 
          type="button"
          onClick={() => setAllAgreed(!allAgreed)}
          aria-pressed={allAgreed}
          className={`w-full bg-[#F9F9F9] rounded-[24px] p-6 flex items-center gap-4 border transition-all cursor-pointer ${
            allAgreed ? 'border-hana-ez-600 bg-[#EFFFFD]' : 'border-[#F2F3F5] bg-white'
          }`}
        >
          <div 
            aria-hidden="true"
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              allAgreed ? 'bg-hana-ez-600 border-hana-ez-600' : 'bg-white border-gray-300'
            }`}
          >
            {allAgreed && <Check className="w-4 h-4 text-white" />}
          </div>
          <span className={`text-[18px] font-bold ${allAgreed ? 'text-hana-ez-600' : 'text-[#1A1A1A]'}`}>
            전체 동의
          </span>
        </button>

        <div className="space-y-5 px-2" role="group" aria-label="상세 약관 동의 항목">
          {[
            '개인정보 수집 및 이용 동의', 
            '제3자 정보 제공 동의', 
            '고유식별정보 처리 동의', 
            '민감정보 처리 동의'
          ].map(text => (
            <div key={text} className="flex justify-between items-center group">
              <span className="text-[14px] text-[#1F2937]">[필수] {text}</span>
              <div 
                aria-hidden="true"
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                  allAgreed ? 'bg-hana-ez-600 text-white' : 'bg-gray-200 text-white'
                }`}
              >
                <Check className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <PrimaryButton 
          label="다음" 
          onClick={onNext} 
          disabled={!allAgreed} 
        />
      </div>
    </div>
  );
}
