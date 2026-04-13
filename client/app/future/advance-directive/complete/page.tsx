'use client';

import Header from '@/components/Header';
import CompletePage from '@/app/future/components/CompletePage';
import { Route } from 'next';

export default function AdvanceDirectiveCompletePage() {
  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col">
      <Header title="연명의료 결정" />
      <CompletePage confirmHref={'/future/advance-directive' as Route} />
    </div>
  );
}