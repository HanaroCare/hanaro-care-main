'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import PrimaryButton from '@/components/PrimaryButton';
import { Check } from 'lucide-react';

export default function Step4Done() {
  const router = useRouter();

  const handleFinish = () => {
    // 임시 저장된 ID를 가져와서 기존 공유 배열에 추가
    const pendingIdStr = localStorage.getItem('pending_share_id');
    if (pendingIdStr) {
      const pendingId = Number(pendingIdStr);
      const sharedIdsStr = localStorage.getItem('shared_family_ids');
      let sharedIds: number[] = [];
      
      if (sharedIdsStr) {
        sharedIds = JSON.parse(sharedIdsStr);
      }
      
      if (!sharedIds.includes(pendingId)) {
        sharedIds.push(pendingId);
      }
      
      localStorage.setItem('shared_family_ids', JSON.stringify(sharedIds));
      localStorage.removeItem('pending_share_id');
    }
    router.push('/myhana/family');
  };

  return (
    <div className="flex flex-col flex-1 px-6 py-16 text-center">
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="w-24 h-24 rounded-full bg-[#EFFFFE] flex items-center justify-center text-hana-ez-600 border-4 border-hana-ez-600/10 shadow-sm animate-star-float">
          <Check className="w-12 h-12" />
        </div>
        <div>
          <h2 className="text-[28px] font-bold leading-tight text-[#1A1A1A] tracking-tight">
            보험 정보 공유가<br />완료되었습니다
          </h2>
          <p className="text-[#6A7282] mt-4 text-[14px] leading-6">
            이제 등록된 가족이 내 보험 내역을<br />
            함께 확인할 수 있어요.
          </p>
        </div>
      </div>

      <div className="space-y-3 mt-10">
        <PrimaryButton 
          label="확인" 
          onClick={handleFinish} 
        />
        <button 
          type="button"
          onClick={handleFinish}
          className="w-full h-14 bg-[#E9F8F9] text-hana-ez-600 rounded-[10px] font-semibold text-[17px] transition active:scale-95"
        >
          가족 추가 등록하기
        </button>
      </div>
    </div>
  );
}
