'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  getFamilyTrustDetail,
  getTrustProductSummary,
  type TrustProductDetail,
} from '@/app/asset/actions/trust';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import InfoBox from '@/components/modules/InfoBox';
import Header from '@/components/navigation/Header';
import { NavigationBar } from '@/components/navigation/NavigationBar';
import { AssetDetailCard } from '../../components/trust/AssetDetailCard';
import { AssetSummaryCard } from '../../components/trust/AssetSummaryCard';
import { ExecutionListCard } from '../../components/trust/ExecutionListCard';
import { PortfolioCard } from '../../components/trust/PortfolioCard';

type TrustUsageType = 'hospital' | 'living' | 'both';

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const grantorId = searchParams.get('grantorId');

  const [detail, setDetail] = useState<TrustProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isParentMode = Boolean(grantorId);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);

        if (grantorId) {
          const data = await getFamilyTrustDetail(Number(grantorId));
          setDetail(data);
        } else {
          const data = await getTrustProductSummary();
          setDetail(data);
        }
      } catch (error) {
        console.error('신탁 상세 조회 실패', error);
        setDetail(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [grantorId]);

  const usageType: TrustUsageType = useMemo(() => {
    if (!detail?.executionSetting) return 'both';

    const { hospitalEnabled, livingEnabled } = detail.executionSetting;

    if (hospitalEnabled && livingEnabled) return 'both';
    if (hospitalEnabled) return 'hospital';
    if (livingEnabled) return 'living';
    return 'both';
  }, [detail]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <Header title="신탁 운용 현황" showBackButton />
        <div className="p-4 text-[14px] text-[#9CA3AF]">불러오는 중...</div>
        <NavigationBar />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <Header title="신탁 운용 현황" showBackButton />
        <div className="p-4 text-[14px] text-[#9CA3AF]">
          조회할 신탁 정보가 없어요.
        </div>
        <NavigationBar />
      </div>
    );
  }

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

        <AssetSummaryCard
          currentAmount={detail.currentAmount}
          profitRate={detail.profitRate}
        />

        <AssetDetailCard
          principalAmount={detail.principalAmount}
          executionAmount={detail.executionAmount}
          profit={detail.profit}
          currentAmount={detail.currentAmount}
        />

        <PortfolioCard />

        <ExecutionListCard
          type={usageType}
          hospitalAmount={detail.executionSetting?.hospitalAmount}
          livingAmount={detail.executionSetting?.livingAmount}
        />

        {!isParentMode && (
          <PrimaryButton
            label="신탁 설정 변경하기"
            className="h-14 rounded-2xl"
            onClick={() => router.push('/asset/trust/change-usage')}
          />
        )}
      </div>

      <NavigationBar />
    </div>
  );
}
