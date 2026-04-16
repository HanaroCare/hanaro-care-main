import { NavigationBar } from '@/components/navigation/NavigationBar';
import { getAssetDashboard, getSimulationSummary } from './asset/actions/asset';
import {
  getBatchNotificationStatus,
  getHousingPensionStatus,
  getInheritancePlanStatus,
} from './asset/actions/notificationStatus';
import { getTrustProductSummary } from './asset/actions/trust';
import { AssetDashboard } from './asset/components/AssetDashboard';
import { MedicalBudgetCard } from './asset/components/MedicalBudgetCard';
import { BannerCard } from './asset/components/notification/BannerCard';
import { InheritanceStepCard } from './asset/components/notification/InheritanceStepCard';
import { LivingExpenseCard } from './asset/components/notification/LivingExpenseCard';
import { MedicalBillCard } from './asset/components/notification/MedicalBillCard';
import { PensionCard } from './asset/components/notification/PensionCard';
import { RealAssetCard } from './asset/components/RealAssetListCard';

export default async function Home() {
  const [
    assetData,
    simulationResult,
    trustProduct,
    hasInheritancePlan,
    hasHousingPension,
    batchNotifications,
  ] = await Promise.all([
    getAssetDashboard().catch(() => null),
    getSimulationSummary(),
    getTrustProductSummary(),
    getInheritancePlanStatus(),
    getHousingPensionStatus(),
    getBatchNotificationStatus(),
  ]);

  const simulationData = simulationResult.ok ? simulationResult.data : null;
  const hasCompletedSimulation = simulationResult.ok;
  const hasTrustProduct = trustProduct !== null;
  const hasLinkedMyData = assetData?.isMyDataLinked ?? false;
  const hasRegisteredRealAssets = (assetData?.realAssets?.length ?? 0) > 0;
  const hasLinkedAssets = hasLinkedMyData && hasRegisteredRealAssets;

  // 상속 설계 단계 계산 (null = 모두 완료 → 카드 숨김)
  const inheritanceStep = !hasLinkedAssets
    ? (1 as const)
    : !hasInheritancePlan
      ? (2 as const)
      : !hasTrustProduct
        ? (3 as const)
        : null;

  return (
    <main className="flex flex-col items-center gap-6 px-6 pt-6 pb-25">
      <div className="flex w-full justify-start">
        <div className="flex font-bold font-hana text-[18px] tracking-[-0.36px]">
          <span className="text-black">Hana</span>
          <span className="text-hana-green-700">Care</span>
        </div>
      </div>

      <AssetDashboard data={assetData} />
      <MedicalBudgetCard
        data={simulationData}
        totalFinancialAmt={assetData?.totalFinancialAmt ?? 0}
      />
      <RealAssetCard data={assetData?.realAssets} />

      {/* 시뮬레이션 미완료 → 병원비 계산 유도 */}
      {!hasCompletedSimulation && (
        <BannerCard
          title={<>내 남은 인생,{'\n'}평생 병원비 걱정 없을까요?</>}
          buttonText="병원비 계산하기"
          imageSrc="/images/asset/medical.svg"
          href="/simulator"
        />
      )}

      {/* 시뮬레이션 완료 + 신탁 연결 → 병원비 부담 감소 알림 */}
      {hasCompletedSimulation && hasTrustProduct && (
        <BannerCard
          title={
            <>
              남노인 손님,{'\n'}
              병원비 부담이 <span className="text-hana-red-500">30%</span>{' '}
              줄었네요
            </>
          }
          buttonText="확인하러 가기"
          imageSrc="/images/asset/asset-big-change.svg"
          href="/simulator/result"
        />
      )}

      {/* 상속 설계 미완료 → 상속 계산 유도 */}
      {!hasInheritancePlan && (
        <BannerCard
          title={<>미리 준비하는 상속{'\n'}가족 모두가 든든해져요</>}
          buttonText="상속 계산하기"
          imageSrc="/images/asset/inheritance-recom.svg"
          href="/inheritance/plan"
        />
      )}

      {/* 주택연금 설계 미완료 → 주택연금 설계 유도 */}
      {!hasHousingPension && (
        <BannerCard
          title={<>내 집에 살면서{'\n'}매달 안정적인 생활비를 받아보세요</>}
          buttonText="주택연금 설계하기"
          imageSrc="/images/asset/housing-pension.svg"
          // href="/asset/home-pension"
        />
      )}

      {/* 배치 기반 알림: 요양보호사 이번달 지출 */}
      {batchNotifications.medicalBill && (
        <MedicalBillCard
          usedAmount={batchNotifications.medicalBill.usedAmount}
          totalLimit={batchNotifications.medicalBill.totalLimit}
        />
      )}

      {/* 배치 기반 알림: 이번달 연금 수령일 */}
      {batchNotifications.pension && (
        <PensionCard
          totalAmount={batchNotifications.pension.totalAmount}
          items={batchNotifications.pension.items}
        />
      )}

      {/* 배치 기반 알림: 생활비 예산 초과 */}
      {batchNotifications.livingExpense && (
        <LivingExpenseCard
          overAmount={batchNotifications.livingExpense.overAmount}
        />
      )}

      {/* 상속 설계 단계 카드 (모두 완료 시 숨김) */}
      {inheritanceStep !== null && (
        <InheritanceStepCard currentStep={inheritanceStep} />
      )}

      <NavigationBar />
    </main>
  );
}
