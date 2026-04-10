import { FinancialAssetCard } from './asset/component/FinancialAssetCard';
import { MainFeatureCard } from './asset/component/MainFeatureCard';
import { NavigationBar } from './asset/component/NavigationBar';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-zinc-50 p-6 pb-[100px] font-sans gap-8">
      {/* Existing Financial Asset Component */}
      <FinancialAssetCard />

      {/* Main Feature Cards Showcase */}
      
      {/* [1] Medical Bill Case */}
      <MainFeatureCard 
        title={<>내 남은 인생,{"\n"}평생 병원비 걱정 없을까요?</>}
        buttonText="병원비 계산하기"
        imageSrc="/images/medical.svg"
      />

      {/* [2] Inheritance Case */}
      <MainFeatureCard 
        title={<>미리 준비하는 상속{"\n"}가족 모두가 든든해져요</>}
        buttonText="상속 계산하기"
        imageSrc="/images/inheritance-recom.svg"
      />

      {/* [3] Big Change Case */}
      <MainFeatureCard 
        title={
          <>
            남노인 손님,{"\n"}
            병원비 부담이 <span className="text-[#D60003]">30%</span> 줄었네요
          </>
        }
        buttonText="확인하러 가기"
        imageSrc="/images/asset-big-change.svg"
      />

      {/* [4] Housing Pension Case */}
      <MainFeatureCard 
        title={<>내 집에 살면서{"\n"}매달 안정적인 생활비를 받아보세요</>}
        buttonText="확인하러 가기"
        imageSrc="/images/housing-pension.svg"
      />

      <NavigationBar />
    </div>
  );
}
