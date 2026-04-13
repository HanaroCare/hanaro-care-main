'use client';

import { motion } from 'framer-motion';
import { Home, PieChart, User, Wallet } from 'lucide-react';
import type { Route } from 'next';
import { usePathname, useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { id: 'home', label: '홈', Icon: Home, href: '/' },
  {
    id: 'assets',
    label: '자산 설계',
    Icon: PieChart,
    href: '/asset/simulator',
  },
  { id: 'wallet', label: '돌봄 지갑', Icon: Wallet, href: '/wallet' },
  { id: 'my', label: 'My하나', Icon: User, href: '/my' },
];

export function NavigationBar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {/* 고정된 네비바만큼의 공간을 확보해주는 div */}
      {/* <div className="h-16.25 w-full" aria-hidden="true" /> */}

      {/* 실제 하단 고정 네비바 */}
      <nav className="-translate-x-1/2 fixed bottom-0 left-1/2 z-50 flex h-16.25 w-full max-w-93.75 items-center justify-around bg-white px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {NAV_ITEMS.map(({ id, label, Icon, href }) => {
          // 활성화 로직 상세 설정
          let isActive = false;
          if (id === 'home') {
            // 메인 홈이거나, 시뮬레이터가 아닌 일반 자산(/asset) 페이지들인 경우 '홈' 활성화
            isActive =
              pathname === '/' ||
              (pathname.startsWith('/asset') &&
                !pathname.startsWith('/asset/simulator'));
          } else {
            // 나머지는 해당 경로로 시작할 때 활성화
            isActive = pathname.startsWith(href);
          }

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
