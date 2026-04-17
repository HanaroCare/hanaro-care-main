'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';
import Header from '@/components/navigation/Header';
import { NavigationBar } from '@/components/navigation/NavigationBar';

export default function GuardianLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-white">
        <Header title="후견인 등록" />
        <main className="px-6.25 pb-20.25">{children}</main>
      </div>
      <NavigationBar />
    </QueryClientProvider>
  );
}
