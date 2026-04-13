'use client';

import type { ReactNode } from 'react';
import Header from '@/components/navigation/Header';
import { NavigationBar } from '@/components/navigation/NavigationBar';

export default function GuardianLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="bg-white">
        <Header title="보험 상세" />
        <main className="px-6.25 pb-16">{children}</main>
      </div>
      <NavigationBar />
    </>
  );
}
