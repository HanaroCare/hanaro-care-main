'use client';

import type { ReactNode } from 'react';
// import Header from '@/components/Header';
import { NavigationBar } from '@/components/NavigationBar';

export default function GuardianLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="bg-white">
        {/* <Header title="보험 상세" /> */}
        <main className="px-6.25 pt-16 pb-16">{children}</main>
      </div>
      <NavigationBar />
    </>
  );
}
