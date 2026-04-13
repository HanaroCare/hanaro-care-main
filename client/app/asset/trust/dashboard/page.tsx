
'use client';

import { useRouter } from 'next/navigation';
import { NavigationBar } from '@/components/NavigationBar';

export default function TrustDashboardPage() {
  const router = useRouter();

  return (
    <div className="app-shell bg-white">
      <div className="app-layout">
        <main className="app-main no-scrollbar p-6 pt-10">
          <h1 className="font-bold text-[#1F2937] text-[28px] leading-tight tracking-tight">
            신탁 대시보드
          </h1>
          <p className="mt-2 font-medium text-[#6A7282] text-[15px]">
            내 신탁 현황을 한눈에 확인해보세요.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center space-y-4">
            <div className="flex size-40 items-center justify-center rounded-full bg-hana-silver-50">
              <span className="text-[14px] text-hana-black-300">
                준비 중인 서비스입니다
              </span>
            </div>
          </div>
        </main>
        <NavigationBar />
      </div>
    </div>
  );
}
