'use client';

import Header from '@/components/Header';
import CompletePage from '@/app/future/components/CompletePage';
import { Route } from 'next';

export default function OrganDonationCompletePage() {
  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col">
      <Header title="새생명 나눔" />
      <CompletePage confirmHref={'/future/organ-donation' as Route} />
    </div>
  );
}