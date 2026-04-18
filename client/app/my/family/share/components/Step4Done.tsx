'use client';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import CompleteStep from '@/components/modules/CompleteStep';
import { updateInsurancePermission } from '../../../actions/familyActions';

export default function Step4Done({
  insuranceCount,
}: {
  insuranceCount: number;
}) {
  const router = useRouter();

  const handleFinish = async () => {
    // 임시 저장된 ID를 가져와서 서버 API 호출
    const pendingIdStr = localStorage.getItem('pending_share_id');
    if (pendingIdStr) {
      try {
        await updateInsurancePermission({
          granteeId: pendingIdStr,
          isInsView: true,
        });
        localStorage.removeItem('pending_share_id');
      } catch (error) {
        console.error('보험 공유 권한 저장 실패:', error);
        alert('권한 저장에 실패했습니다. 다시 시도해주세요.');
        return;
      }
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
