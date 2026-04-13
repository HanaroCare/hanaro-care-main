'use client';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import CompleteStep from '@/components/modules/CompleteStep';

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
    <CompleteStep
      footer={
        <>
          <PrimaryButton label="확인" onClick={handleFinish} />
          <PrimaryButton
            label="가족 추가 등록하기"
            variant="secondary"
            onClick={handleFinish}
          />
        </>
      }
    >
      <div className="text-center">
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
    </CompleteStep>
  );
}
