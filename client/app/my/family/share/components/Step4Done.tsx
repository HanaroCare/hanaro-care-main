'use client';

import { Check } from 'lucide-react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import PrimaryButton from '@/components/baseelements/PrimaryButton';

export default function Step4Done({
  insuranceCount,
}: {
  insuranceCount: number;
}) {
  const router = useRouter();

  const handleFinish = () => {
    // 임시 저장된 ID를 가져와서 기존 공유 배열에 추가
    const pendingIdStr = localStorage.getItem('pending_share_id');
    if (pendingIdStr) {
      const pendingId = Number(pendingIdStr);
      const sharedDataStr = localStorage.getItem('shared_family_ids');
      let sharedData: { id: number; insuranceCount: number }[] = [];

      if (sharedDataStr) {
        try {
          const parsed = JSON.parse(sharedDataStr);
          if (Array.isArray(parsed)) {
            // 호환성을 위해 기존 number[] 형식 체크 및 변환
            sharedData = parsed.map((item) =>
              typeof item === 'number' ? { id: item, insuranceCount: 3 } : item,
            );
          }
        } catch (e) {
          console.warn(
            'Failed to parse shared_family_ids from localStorage in Step4Done:',
            e,
          );
        }
      }

      const existingIndex = sharedData.findIndex(
        (item) => item.id === pendingId,
      );
      if (existingIndex > -1) {
        sharedData[existingIndex].insuranceCount = insuranceCount;
      } else {
        sharedData.push({ id: pendingId, insuranceCount });
      }

      localStorage.setItem('shared_family_ids', JSON.stringify(sharedData));
      localStorage.removeItem('pending_share_id');
    }
    router.push('/my/family' as Route);
  };

  return (
    <div className="flex flex-1 flex-col px-6 py-16 text-center">
      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        <div className="flex h-24 w-24 animate-star-float items-center justify-center rounded-full border-4 border-hana-ez-600/10 bg-[#EFFFFE] text-hana-ez-600 shadow-sm">
          <Check className="h-12 w-12" />
        </div>
        <div>
          <h2 className="font-bold text-[#1A1A1A] text-[28px] leading-tight tracking-tight">
            보험 정보 공유가
            <br />
            완료되었습니다
          </h2>
          <p className="mt-4 text-[#6A7282] text-[14px] leading-6">
            이제 등록된 가족이 내 보험 내역을
            <br />
            함께 확인할 수 있어요.
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-3">
        <PrimaryButton label="확인" onClick={handleFinish} />
        <button
          type="button"
          onClick={handleFinish}
          className="h-14 w-full rounded-[10px] bg-[#E9F8F9] font-semibold text-[17px] text-hana-ez-600 transition active:scale-95"
        >
          가족 추가 등록하기
        </button>
      </div>
    </div>
  );
}
