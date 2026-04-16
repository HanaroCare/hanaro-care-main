import { NavigationBar } from '@/components/navigation/NavigationBar';
import { getAssetDashboard, getSimulationSummary } from './asset/actions/asset';
import { getBannerStatus } from './asset/actions/notificationStatus';
import { AssetDashboard } from './asset/components/AssetDashboard';
import { MedicalBudgetCard } from './asset/components/MedicalBudgetCard';
import { BannerCard } from './asset/components/notification/BannerCard';
import { InheritanceStepCard } from './asset/components/notification/InheritanceStepCard';
import { MedicalBillCard } from './asset/components/notification/MedicalBillCard';
import { PensionCard } from './asset/components/notification/PensionCard';
import { RealAssetCard } from './asset/components/RealAssetListCard';

// 배너 우선순위
// Group 1 (최우선): 시뮬레이션
//   - simulation-cta    : 시뮬레이션 미완료
//   - simulation-result : 시뮬레이션 완료 + 주택연금 상품 실제 가입
// Group 2 (동순위 → 1개만): 때에 따라 선택
//   - pension           : 오늘이 연금 수령일 (가장 시간 한정적)
//   - medical-bill      : 요양보호사 카드 이번달 지출
//   - inheritance-cta   : 상속 설계 미완료 (BannerCard) - step 1·2에서 선택
//   - inheritance-step  : 상속 설계 단계 진행 중 (InheritanceStepCard) - step 3에서 선택
//   - housing-pension   : 주택연금 설계 미완료
type ActiveBanner =
  | { type: 'simulation-cta' }
  | { type: 'simulation-result'; userName: string; monthlyPayout: number }
  | { type: 'pension'; totalAmount: number; items: { name: string; amount: number }[] }
  | { type: 'medical-bill'; usedAmount: number; totalLimit: number }
  | { type: 'inheritance-cta' }
  | { type: 'inheritance-step'; step: 1 | 2 | 3 }
  | { type: 'housing-pension' }
  | null;

export default async function Home() {
  const [assetData, simulationResult, bannerStatus] = await Promise.all([
    getAssetDashboard().catch(() => null),
    getSimulationSummary(),
    getBannerStatus(),
  ]);

  const simulationData = simulationResult.ok ? simulationResult.data : null;

  const {
    userName,
    hasCompletedSimulation,
    hasInheritancePlan,
    hasHousingPension,
    hasTrustProduct,
    housingPensionProduct,
    medicalBill,
    pension,
  } = bannerStatus;

  const hasLinkedMyData = assetData?.isMyDataLinked ?? false;
  const hasRegisteredRealAssets = (assetData?.realAssets?.length ?? 0) > 0;
  const hasLinkedAssets = hasLinkedMyData && hasRegisteredRealAssets;

  const inheritanceStep = !hasLinkedAssets
    ? (1 as const)
    : !hasInheritancePlan
      ? (2 as const)
      : !hasTrustProduct
        ? (3 as const)
        : null;

  // ─── 표시할 배너 1개 결정 ───
  const activeBanner: ActiveBanner = (() => {
    // 마이데이터 미연결 시 배너 전체 미표시
    if (!hasLinkedMyData) return null;

    // Group 1: 시뮬레이션 (최우선)
    if (!hasCompletedSimulation) return { type: 'simulation-cta' };
    // 시뮬레이션만으로는 미표시 — 주택연금 상품 실제 가입 시에만 표시
    if (housingPensionProduct) {
      return {
        type: 'simulation-result',
        userName,
        monthlyPayout: housingPensionProduct.monthlyPayout,
      };
    }

    // Group 2: 동순위 → 시기적 긴급도 순으로 첫 번째 해당 항목
    if (pension) return { type: 'pension', ...pension };
    if (medicalBill) return { type: 'medical-bill', ...medicalBill };
    // 상속 설계 미완료(step 1·2) → BannerCard, 신탁 연결만 남은 경우(step 3) → InheritanceStepCard
    if (!hasInheritancePlan) return { type: 'inheritance-cta' };
    if (inheritanceStep === 3) return { type: 'inheritance-step', step: 3 };
    if (!hasHousingPension) return { type: 'housing-pension' };

    return null;
  })();

  return (
    <main className="flex flex-col items-center gap-6 px-6 pt-6 pb-25">
      <div className="flex w-full justify-start">
        <div className="flex font-bold font-hana text-[18px] tracking-[-0.36px]">
          <span className="text-black">Hana</span>
          <span className="text-hana-green-700">Care</span>
        </div>
      </div>

      {activeBanner?.type === 'simulation-cta' && (
        <BannerCard
          title={<>내 남은 인생,{'\n'}평생 병원비 걱정 없을까요?</>}
          buttonText="병원비 계산하기"
          imageSrc="/images/asset/medical.svg"
          href="/simulator"
        />
      )}

      {activeBanner?.type === 'simulation-result' && (
        <BannerCard
          title={
            <>
              {activeBanner.userName} 손님,{'\n'}
              매달{' '}
              <span className="text-hana-red-500">
                {(activeBanner.monthlyPayout / 10000).toLocaleString()}만원
              </span>{' '}
              수령으로{'\n'} 병원비 부담이 줄었네요
            </>
          }
          buttonText="확인하러 가기"
          imageSrc="/images/asset/asset-big-change.svg"
          href="asset/simulator/result"
        />
      )}

      {activeBanner?.type === 'pension' && (
        <PensionCard
          totalAmount={activeBanner.totalAmount}
          items={activeBanner.items}
        />
      )}

      {activeBanner?.type === 'medical-bill' && (
        <MedicalBillCard
          usedAmount={activeBanner.usedAmount}
          totalLimit={activeBanner.totalLimit}
        />
      )}

      {activeBanner?.type === 'inheritance-cta' && (
        <BannerCard
          title={<>미리 준비하는 상속{'\n'}가족 모두가 든든해져요</>}
          buttonText="상속 계산하기"
          imageSrc="/images/asset/inheritance-recom.svg"
          href="/inheritance/plan"
        />
      )}

      {activeBanner?.type === 'inheritance-step' && (
        <InheritanceStepCard currentStep={activeBanner.step} />
      )}

      {activeBanner?.type === 'housing-pension' && (
        <BannerCard
          title={<>내 집에 살면서{'\n'}매달 안정적인 생활비를 받아보세요</>}
          buttonText="주택연금 설계하기"
          imageSrc="/images/asset/housing-pension.svg"
          // href="/asset/home-pension"
        />
      )}
      <AssetDashboard data={assetData} />
      {hasLinkedMyData && (
        <MedicalBudgetCard
          data={simulationData}
          totalFinancialAmt={assetData?.totalFinancialAmt ?? 0}
        />
      )}
      <RealAssetCard data={assetData?.realAssets} />


      <NavigationBar />
    </main>
  );
}
