'use client';

import React from 'react';
import type { Route } from 'next';
import SubHeader from '@/components/SubHeader';
import TrustProgressBar from '@/app/asset/components/trust/TrustProgressBar';

interface ProgressHeaderProps {
  step: number;
}

export default function ProgressHeader({ step }: ProgressHeaderProps) {
  return (
    <div className="flex flex-col w-full bg-white z-20 shrink-0">
      <SubHeader 
        title="보험 내역 공유" 
        backUrl={'/myhana/family' as Route} 
        closeUrl={'/myhana/family' as Route} 
      />
      <div className="px-6 py-2">
        <TrustProgressBar step={step} total={4} />
      </div>
    </div>
  );
}
