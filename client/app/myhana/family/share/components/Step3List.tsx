'use client';

import React, { useState } from 'react';
import PrimaryButton from '@/components/PrimaryButton';
import { ShieldCheck, Info } from 'lucide-react';

export default function Step3List({ onNext }: { onNext: (count: number) => void }) {
  const [selected, setSelected] = useState<number[]>([]);
  const list = [
    { id: 1, name: '하나 건강보험', company: '하나생명', price: '월 150,000원', warning: true },
    { id: 2, name: '삼성 화재보험', company: '삼성화재', price: '월 20,000원', warning: false },
    { id: 3, name: '교보 생명보험', company: '교보생명', price: '월 180,000원', warning: false }
  ];

  const toggleSelection = (id: number) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col flex-1 px-6 py-10">
      <div className="mb-8">
        <h2 className="text-[22px] font-bold leading-[1.45] tracking-tight text-[#1A1A1A]">
          공유할 보험 항목을<br />선택해주세요
        </h2>
        <p className="text-[12px] text-[#6A7282] mt-3">마이데이터로 조회된 내역이에요</p>
      </div>

      <div className="flex-1 space-y-4">
        {list.map(item => {
          const isSelected = selected.includes(item.id);
          return (
            <label 
              key={item.id} 
              className={`flex items-center gap-4 p-5 rounded-[24px] border-2 transition-all cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.03)] ${
                isSelected ? 'border-hana-ez-600 bg-[#EFFFFD]' : 'border-[#F2F3F5] bg-white'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-colors ${
                isSelected ? 'bg-white border-hana-ez-600 text-hana-ez-600' : 'bg-gray-50 border-gray-100 text-gray-300'
              }`}>
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex-1 relative">
                <p className="text-[12px] text-[#6A7282] leading-5 font-normal">{item.company}</p>
                <p className={`font-bold text-[16px] leading-6 tracking-tight ${isSelected ? 'text-hana-ez-600' : 'text-[#1F2937]'}`}>
                  {item.name}
                </p>
                <p className="text-[#6A7282] text-[14px] leading-5 mt-1">{item.price}</p>
                {item.warning && (
                  <span className="absolute top-0 right-0 px-2 py-0.5 bg-[#FFF1F1] text-hana-red-500 rounded-full text-[10px] font-bold flex items-center gap-1">
                    <Info className="w-2 h-2" /> 확인 필요
                  </span>
                )}
              </div>
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={isSelected}
                onChange={() => toggleSelection(item.id)}
              />
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                isSelected ? 'bg-hana-ez-600 border-hana-ez-600' : 'bg-white border-gray-300'
              }`}>
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
              </div>
            </label>
          );
        })}
        
        <div className="mt-6 flex items-start gap-2 text-[#8A8A8A] text-[11px] leading-relaxed">
          <Info className="w-3 h-3 shrink-0 mt-0.5" />
          <p>공유 설정된 보험 정보는 등록된 가족만 열람 가능하며, 이체 및 계약 변경은 불가합니다.</p>
        </div>
      </div>

      <div className="mt-8">
        <PrimaryButton 
          label="권한 등록" 
          onClick={() => onNext(selected.length)} 
          disabled={selected.length === 0} 
        />
      </div>
    </div>
  );
}
