'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TrustStepLayout from '@/app/asset/components/trust/TrustStepLayout';
import TrustProgressBar from '@/app/asset/components/trust/TrustProgressBar';
import NextButton from '@/components/NextButton';
import styles from './page.module.css';

export default function InheritancePlanPage() {
  const router = useRouter();

  return (
    <TrustStepLayout
      footer={
        <div className="px-6 pb-8 bg-white">
          <NextButton 
            label="다음으로" 
            onClick={() => router.push('/inheritance/plan/1')} 
          />
        </div>
      }
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-14 bg-white shrink-0">
        <Link href="/inheritance/intro" className={styles.headerBtn} aria-label="뒤로가기">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <span className="text-lg font-semibold">상속 설계</span>
        <button type="button" className={styles.headerBtn} aria-label="닫기" onClick={() => router.push('/inheritance')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </header>

      <div className="px-6">
        <div className="py-2">
          <TrustProgressBar step={1} total={5} />
        </div>

        <div className="pt-6 pb-10">
          <p className="text-hana-ez-600 font-medium mb-1">권하나 손님의 상속설계를 도와드릴게요</p>
          <h1 className="text-2xl font-bold mb-8">상속할 자산을 확인해주세요</h1>

          {/* Financial assets card */}
          <div className="bg-gray-50 rounded-3xl p-6 mb-4">
            <p className="text-gray-500 text-sm mb-1">연동 총 자산</p>
            <p className="text-2xl font-bold mb-4">13.4억원</p>

            <div className="h-px bg-gray-200 mb-4" />

            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <span className="text-gray-600">예·적금</span>
                <span className="font-medium">2,800만원</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-600">주식·펀드</span>
                <span className="font-medium">7,200만원</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-600">연금</span>
                <span className="font-medium">2,300만원</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-600">보통예금</span>
                <span className="font-medium">1,680만원</span>
              </li>
            </ul>
          </div>

          {/* Real estate card */}
          <div className="bg-gray-50 rounded-3xl p-6">
            <p className="text-gray-500 text-sm mb-1">부동산</p>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">아파트 (서울 강남구)</span>
              <span className="text-hana-ez-600 font-bold text-lg">12.0억원</span>
            </div>
          </div>
        </div>
      </div>
    </TrustStepLayout>
  );
}
