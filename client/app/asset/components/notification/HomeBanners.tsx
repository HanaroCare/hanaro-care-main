'use client';

import { Lightbulb } from 'lucide-react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AlertBanner } from '@/components/modules/AlertBanner';
import { acceptFamilyInvite } from '@/app/my/actions/familyActions';
import { getCardUsageDetail } from '@/app/card/actions/card';

type HomeBannersProps = {
  isInvitedUser: boolean;
  /** 서버에서 내려온 grantor 여부. true이면 초대 배너를 노출하지 않음 */
  isGrantor: boolean;
  /** TSID 정밀도 유지를 위해 string[]. Number 변환 금지 */
  abnormalCardIds: string[];
  /** TSID 정밀도 유지를 위해 string. Number 변환 금지 */
  firstAbnormalUsageId: string | null;
};

export function HomeBanners({ isInvitedUser, isGrantor, abnormalCardIds, firstAbnormalUsageId }: HomeBannersProps) {
  const router = useRouter();
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // grantor(초대 생성자)이면 localStorage 토큰을 즉시 삭제하고 배너를 띄우지 않음
    if (isGrantor) {
      localStorage.removeItem('family_invite_token');
      return;
    }
    const token = localStorage.getItem('family_invite_token');
    if (token) setInviteToken(token);
  }, [isGrantor]);

  const handleInviteAuth = async () => {
    if (isLoading) return;
    setIsLoading(true);
    if (inviteToken) {
      try {
        await acceptFamilyInvite(inviteToken);
      } catch (err) {
        console.error('[acceptFamilyInvite 실패]', err);
        const message = err instanceof Error ? err.message : String(err);
        // 에러 코드별 사용자 안내 메시지
        const userMessage = message.includes('계좌')
          ? '연동할 계좌 정보가 없습니다.\n마이데이터를 먼저 연결해 주세요.'
          : message.includes('자기 자신')
          ? '본인이 생성한 초대 링크는 수락할 수 없습니다.'
          : message.includes('이미 가족')
          ? '이미 가족으로 등록된 사용자입니다.'
          : `가족 인증 등록 실패: ${message}`;
        alert(userMessage);
        setIsLoading(false);
        return;
      }
      localStorage.removeItem('family_invite_token');
    }
    router.push('/my/family' as Route);
  };

  // grantor는 배너 노출 대상에서 제외
  const showInviteBanner = !isGrantor && (isInvitedUser || !!inviteToken || isLoading);

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
          onActionAction={async () => {
            console.log('[DEBUG] usageId:', firstAbnormalUsageId);

            // 카드 1개 + 특정 이상 거래로 직접 이동하는 경우: 존재 여부 먼저 검증
            if (abnormalCardIds.length === 1 && firstAbnormalUsageId) {
              try {
                await getCardUsageDetail(firstAbnormalUsageId);
              } catch {
                alert('카드 정보를 불러올 수 없습니다.');
                return;
              }
              router.push(`/card/usage/${firstAbnormalUsageId}` as Route);
            } else {
              router.push('/card' as Route);
            }
          }}
        />
      )}
    </>
  );
}
