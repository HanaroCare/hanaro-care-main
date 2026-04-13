'use client';

import React from 'react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import Header from '@/components/navigation/Header';
import TrustProgressBar from '@/app/asset/components/trust/TrustProgressBar';

interface ProgressHeaderProps {
  step: number;
}

export default function ProgressHeader({ step }: ProgressHeaderProps) {
  const router = useRouter();
  
  return (
    <div className="flex flex-col w-full bg-white z-20 shrink-0">
      <Header 
        title="보험 내역 공유" 
        onBack={() => router.push('/myhana/family' as Route)} 
        showCloseButton={true}
        onClose={() => router.push('/myhana/family' as Route)} 
      />
      <div className="px-6 py-2">
        <TrustProgressBar step={step} total={4} />
      </div>
    </div>
  );
}
