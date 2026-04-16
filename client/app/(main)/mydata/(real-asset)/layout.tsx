'use client';

import Header from '@/components/navigation/Header';

export default function RealAssetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col bg-background">
      <Header title="실물 자산 조회" showCloseButton={false} />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
