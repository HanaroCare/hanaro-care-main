'use client';

import React from 'react';

interface InheritanceHeaderProps {
  activeTab: 'asset' | 'inheritance';
}

export default function InheritanceHeader({ activeTab }: InheritanceHeaderProps) {
  return (
    <div className="flex w-full border-b border-gray-100 bg-white z-20 shrink-0">
      <div className={`flex-1 pt-4 pb-2 text-center font-medium cursor-pointer ${
        activeTab === 'asset' 
          ? 'text-[var(--color-hana-ez-600)] font-bold border-b-2 border-[var(--color-hana-ez-600)]' 
          : 'text-gray-400'
      }`}>
        자산
      </div>
      <div className={`flex-1 pt-4 pb-2 text-center font-medium cursor-pointer ${
        activeTab === 'inheritance' 
          ? 'text-[var(--color-hana-ez-600)] font-bold border-b-2 border-[var(--color-hana-ez-600)]' 
          : 'text-gray-400'
      }`}>
        상속
      </div>
    </div>
  );
}
