'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

type Tab = {
  id: string;
  label: string;
};

type AssetTabNavigationProps = {
  initialTab?: string;
  onTabChange?: (tabId: string) => void;
};

const TABS: Tab[] = [
  { id: 'asset', label: '자산' },
  { id: 'realestate', label: '부동산' },
  { id: 'insurance', label: '보험' },
  { id: 'car', label: '자동차' },
  { id: 'gold', label: '금' },
];

export function AssetTabNavigation({
  initialTab = 'asset',
  onTabChange,
}: AssetTabNavigationProps) {
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div className="w-full border-border-gray border-b bg-white">
      <div className="flex w-full">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className={`relative flex flex-1 items-center justify-center py-3 font-medium text-[15px] transition-colors ${
                isActive ? 'text-hana-green-700' : 'text-border-gray'
              }`}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 h-[2px] w-full bg-hana-green-700"
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
