'use client';

import { Lightbulb } from 'lucide-react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AlertBanner } from '@/components/modules/AlertBanner';
import { acceptFamilyInvite } from '@/app/my/actions/familyActions';

type HomeBannersProps = {
  isInvitedUser: boolean;
  abnormalCardIds: number[];
  firstAbnormalUsageId: number | null;
};

export function HomeBanners({ isInvitedUser, abnormalCardIds, firstAbnormalUsageId }: HomeBannersProps) {
  const router = useRouter();
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('family_invite_token');
    if (token) setInviteToken(token);
  }, []);

  const handleInviteAuth = async () => {
    if (isLoading) return;
    setIsLoading(true);
    if (inviteToken) {
      try {
        await acceptFamilyInvite(inviteToken);
      } catch (err) {
        console.error('[acceptFamilyInvite 실패]', err);
        alert(`가족 인증 등록 실패: ${err instanceof Error ? err.message : String(err)}`);
        setIsLoading(false);
        return;
      }
      localStorage.removeItem('family_invite_token');
    }
    router.push('/my/family' as Route);
  };

  const showInviteBanner = isInvitedUser || !!inviteToken || isLoading;

  return (
    <>
      {showInviteBanner && (
        <AlertBanner
          variant="note"
          icon={<Lightbulb size={22} />}
          message={'가족을 통해 가입되셨어요!\n진짜 가족임을 확인해주세요'}
          actionText="인증하기"
          onActionAction={handleInviteAuth}
        />
      )}
      {abnormalCardIds.length > 0 && (
        <AlertBanner
          variant="warning"
          message="이상 거래가 탐지되었어요"
          actionText="확인하기"
          onActionAction={() =>
            router.push(
              (abnormalCardIds.length === 1 && firstAbnormalUsageId
                ? `/card/usage/${firstAbnormalUsageId}`
                : '/card') as Route,
            )
          }
        />
      )}
    </>
  );
}
