'use client';

import { Lightbulb } from 'lucide-react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { AlertBanner } from '@/components/modules/AlertBanner';

type HomeBannersProps = {
  isInvitedUser: boolean;
  abnormalCardIds: number[];
};

export function HomeBanners({ isInvitedUser, abnormalCardIds }: HomeBannersProps) {
  const router = useRouter();

  return (
    <>
      {isInvitedUser && (
        <AlertBanner
          variant="note"
          icon={<Lightbulb size={22} />}
          message={'부모님을 통해 가입되셨어요!\n진짜 가족임을 확인해주세요'}
          actionText="인증하기 >"
          onActionAction={() => router.push('/my/family' as Route)}
        />
      )}
      {abnormalCardIds.length > 0 && (
        <AlertBanner
          variant="warning"
          message="이상 거래가 탐지되었어요"
          actionText="확인하기 >"
          onActionAction={() =>
            router.push(
              (abnormalCardIds.length === 1 ? `/card/${abnormalCardIds[0]}` : '/card') as Route,
            )
          }
        />
      )}
    </>
  );
}
