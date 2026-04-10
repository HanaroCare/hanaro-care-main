'use client';

import { NavigationBar } from '@/components/NavigationBar';
import { AssetDashboard } from './asset/component/AssetDashboard';
import { BannerCard } from './asset/component/BannerCard';
import { LivingExpenseCard } from './asset/component/LivingExpenseCard';
import { MedicalBillCard } from './asset/component/MedicalBillCard';
import { PensionCard } from './asset/component/PensionCard';
import { RealAssetCard } from './asset/component/RealAssetCard';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-6 bg-zinc-50 px-6 pt-6 pb-[100px] font-sans">
      <AssetDashboard />

      <div className="flex flex-col gap-6">
        <BannerCard
          title={<>내 남은 인생,{'\n'}평생 병원비 걱정 없을까요?</>}
          buttonText="병원비 계산하기"
          imageSrc="/images/asset/medical.svg"
          onClick={() => console.log('병원비 계산')}
        />

        <BannerCard
          title={<>미리 준비하는 상속{'\n'}가족 모두가 든든해져요</>}
          buttonText="상속 계산하기"
          imageSrc="/images/asset/inheritance-recom.svg"
          onClick={() => console.log('상속 계산')}
        />

        <BannerCard
          isClosable
          title={
            <>
              남노인 손님,{'\n'}
              병원비 부담이 <span className="text-hana-red-500">30%</span>{' '}
              줄었네요
            </>
          }
          buttonText="확인하러 가기"
          imageSrc="/images/asset/asset-big-change.svg"
          onClick={() => console.log('자산 변동 확인')}
        />

        <BannerCard
          title={<>내 집에 살면서{'\n'}매달 안정적인 생활비를 받아보세요</>}
          buttonText="확인하러 가기"
          imageSrc="/images/asset/housing-pension.svg"
          onClick={() => console.log('주택연금 확인')}
        />
      </div>
      <NavigationBar />
      <RealAssetCard />
      <MedicalBillCard />
      <PensionCard />
      <RealAssetCard />
      <LivingExpenseCard />
    </div>
  );
}
