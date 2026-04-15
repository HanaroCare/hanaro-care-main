'use client';

import { useRouter } from 'next/navigation';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import InfoBox from '@/components/modules/InfoBox';
import Header from '@/components/navigation/Header';
import { NavigationBar } from '@/components/navigation/NavigationBar';
import { AssetDetailCard } from '../../components/trust/AssetDetailCard';
import { AssetSummaryCard } from '../../components/trust/AssetSummaryCard';
import { ExecutionListCard } from '../../components/trust/ExecutionListCard';
import { PortfolioCard } from '../../components/trust/PortfolioCard';

// 테스트를 위해 타입을 정의합니다: 'hospital' | 'living' | 'both'
type TrustUsageType = 'hospital' | 'living' | 'both';

export default function DashboardPage() {
  const router = useRouter();

  // 실제 연동 시에는 상태 관리나 쿼리 파라미터에서 가져오게 됩니다.
  const usageType: TrustUsageType = 'both';

  const highlight = (text: string) => (
    <span className="text-red-500">{text}</span>
  );

  const commentData = {
    hospital: {
      title: '병원비 계산기의 결과에 따라,',
      desc: <>{highlight('병원비')}가 부족하지 않게 운용중이에요!</>,
    },
    living: {
      title: '병원비 계산기의 결과에 따라,',
      desc: <>{highlight('생활비')}가 부족하지 않게 운용중이에요!</>,
    },
    both: {
      title: '병원비 계산기의 결과에 따라,',
      desc: <>{highlight('생활비/병원비')}가 부족하지 않게 운용중이에요!</>,
    },
  };

  const currentComment = commentData[usageType];

  return (
    <div className="min-h-screen bg-white pb-20">
      <Header title="신탁 운용 현황" showBackButton />
      <div className="space-y-4 p-4">
        <InfoBox
          title={currentComment.title}
          desc={currentComment.desc}
          bgColor="#F0F9F9"
          textColor="#008485"
          className="text-center"
        />

        <AssetSummaryCard />
        <AssetDetailCard />
        <PortfolioCard />

        {/* 2. 경우에 맞는 지출 내역 전달 */}
        <ExecutionListCard type={usageType} />

        <PrimaryButton
          label="신탁 설정 변경하기"
          className="h-14 rounded-2xl"
          onClick={() => router.push('/asset/trust/change-usage')}
        />
      </div>
      <NavigationBar />
    </div>
  );
}
