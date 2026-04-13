'use client';

import { CheckCircle, ChevronLeft, X } from 'lucide-react';
import { Route } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ChargeCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardNm = searchParams.get('cardNm') || '김복자 요양사';
  const amount = searchParams.get('amount') || '0';

  return (
    <div className="relative min-h-screen bg-white">
      <div className="flex justify-between items-center px-4 h-[65px] border-b border-black/10">
        <button className="p-1" onClick={() => router.back()}>
          <ChevronLeft size={24} color="#0A0A0A" />
        </button>
        <span className="text-base font-medium tracking-tight text-[#0A0A0A]">
          송금
        </span>
        <button className="p-1" onClick={() => router.push('/card')}>
          <X size={24} color="#0A0A0A" />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center mt-40">
        <CheckCircle size={67} color="#008485" strokeWidth={2.5} />
        <p className="text-2xl font-semibold text-hana-black-800 text-center mt-8 leading-[35px]">
          {cardNm} 카드에
          <br />
          {Number(amount).toLocaleString()}원 충전 완료
        </p>
      </div>

      <div className="absolute bottom-8 left-0 right-0 px-6">
        <button
          onClick={() => router.push('/card' as Route)}
          className="w-full h-[53px] rounded-xl bg-hana-ez-600 text-white text-base font-medium"
        >
          완료
        </button>
      </div>
    </div>
  );
}

export default function ChargeCompletePage() {
  return (
    <Suspense>
      <ChargeCompleteContent />
    </Suspense>
  );
}
