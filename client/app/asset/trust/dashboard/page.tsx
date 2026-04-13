'use client';
import { useRouter } from 'next/navigation';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import InfoBox from '@/components/modules/InfoBox';
import { ActionPanelCard } from '../../components/trust/ActionPanelCard';
import { AssetDetailCard } from '../../components/trust/AssetDetailCard';
import { AssetSummaryCard } from '../../components/trust/AssetSummaryCard';
import { ExecutionListCard } from '../../components/trust/ExecutionListCard';
import { PortfolioCard } from '../../components/trust/PortfolioCard';

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="p-4 space-y-4">
      <AssetSummaryCard />
      <AssetDetailCard />
      <ActionPanelCard
        onChangeLivingLimit={() => router.push('/asset/trust/change-limit')}
        onChangePermission={() => router.push('/asset/trust/change-agent')}
        onBookConsult={() => {
          // 상담 예약
        }}
      />
      <PortfolioCard />
      <ExecutionListCard />
      <InfoBox
        title="전문가 코멘트"
        desc="채권 비중을 높여 안정적으로 운용중입니다."
      />
      <PrimaryButton
        label="설계 변경하기"
        className="h-14 rounded-2xl"
        onClick={() => router.push('/asset/trust/change-usage')}
      />
    </div>
  );
}
