'use client';

import type { ReactNode } from 'react';
import Header from '@/components/Header';
import { NavigationBar } from '@/components/NavigationBar';

export default function GuardianLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="bg-white">
        <Header title="후견인 등록" />
        <main className="px-6.25 pb-20.25">{children}</main>
      </div>
      <NavigationBar />
    </>
  );
}
