import type { ReactNode } from 'react';
import Header from '@/components/navigation/Header';
import { NavigationBar } from '@/components/navigation/NavigationBar';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="bg-white">
        <Header title="상속 편지" />
        <main className="px-6.25">{children}</main>
      </div>
      <NavigationBar />
    </>
  );
}
