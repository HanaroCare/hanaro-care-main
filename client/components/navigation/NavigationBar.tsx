'use client';

import { motion } from 'framer-motion';
import { Home, PieChart, User, Wallet } from 'lucide-react';
import type { Route } from 'next';
import { usePathname, useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { id: 'home', label: '홈', Icon: Home, href: '/' },
  { id: 'assets', label: '자산 설계', Icon: PieChart, href: '/asset' },
  { id: 'wallet', label: '돌봄 지갑', Icon: Wallet, href: '/wallet' },
  { id: 'my', label: 'My하나', Icon: User, href: '/my' },
];

export function NavigationBar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {/* 1. 실제 콘텐츠를 위로 밀어올리는 투명 공간 (여백 역할) */}
      <div className="h-16.25 w-full pb-6" aria-hidden="true" />
      <nav className="-translate-x-1/2 fixed bottom-0 left-1/2 z-50 flex h-16.25 w-full max-w-93.75 items-center justify-around bg-white px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {NAV_ITEMS.map(({ id, label, Icon, href }) => {
          const isActive =
            href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <motion.button
              key={id}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(href as Route)}
              className="flex flex-col items-center gap-1 rounded-lg p-2 outline-none focus-visible:ring-2 focus-visible:ring-hana-green-700/50"
            >
              <Icon
                size={24}
                strokeWidth={2}
                className={
                  isActive ? 'text-hana-green-700' : 'text-hana-black-400'
                }
                aria-hidden="true"
              />
              <span
                className={`font-semibold text-[12px] ${isActive ? 'text-hana-green-700' : 'text-hana-black-400'}`}
              >
                {label}
              </span>
            </motion.button>
          );
        })}
      </nav>
    </>
  );
}
