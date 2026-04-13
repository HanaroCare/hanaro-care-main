'use client';

import React, { useState } from 'react';
import PrimaryButton from '@/components/PrimaryButton';

export default function Step1Auth({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col flex-1 px-6 py-10">
      <h2 className="text-[22px] font-bold mb-3 leading-[1.45] tracking-tight text-[#1A1A1A]">
        본인인증을<br />진행해주세요
      </h2>
      <p className="text-[12px] text-[#6A7282] mb-10">
        본인 명의 휴대폰 또는 하나인증서가 필요해요.
      </p>

      <div className="space-y-4 flex-1">
        {[
          { id: 'p', title: '휴대폰 인증', desc: '문자 인증번호로 본인 확인', icon: '📱' },
          { id: 'h', title: '하나인증서', desc: '패턴·지문·Face ID로 간편 인증', icon: '🛡️' }
        ].map(item => (
          <button 
            key={item.id}
            type="button"
            onClick={() => setSelected(item.id)}
            className={`w-full flex items-center gap-4 p-5 rounded-[24px] border-2 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.03)] ${
              selected === item.id 
                ? 'border-hana-ez-600 bg-[#EFFFFD]' 
                : 'border-[#F2F3F5] bg-white'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-2xl">
              {item.icon}
            </div>
            <div className="flex-1 text-left">
              <p className={`font-bold text-[16px] leading-6 tracking-tight ${selected === item.id ? 'text-hana-ez-600' : 'text-[#1F2937]'}`}>
                {item.title}
              </p>
              <p className="text-[#6A7282] text-[12px] leading-5 font-normal tracking-tight">
                {item.desc}
              </p>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected === item.id ? 'border-hana-ez-600' : 'border-gray-300'}`}>
              {selected === item.id && <div className="w-3 h-3 rounded-full bg-hana-ez-600" />}
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-8">
        <PrimaryButton 
          label="다음" 
          onClick={onNext} 
          disabled={!selected} 
        />
      </div>
    </div>
  );
}
