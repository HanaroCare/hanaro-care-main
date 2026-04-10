'use client';

import { motion } from 'framer-motion';
import { Home, PieChart, User, Wallet } from 'lucide-react';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { id: 'home', label: '홈', Icon: Home, href: '/' },
  { id: 'assets', label: '자산 설계', Icon: PieChart, href: '/asset' },
  { id: 'wallet', label: '돌봄 지갑', Icon: Wallet, href: '/wallet' },
  { id: 'my', label: 'My하나', Icon: User, href: '/my' },
];

export function NavigationBar() {
  const pathname = usePathname();

  return (
    <nav className="-translate-x-1/2 fixed bottom-0 left-1/2 flex h-16.25 w-full max-w-93.75 items-center justify-around bg-white px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      {NAV_ITEMS.map(({ id, label, Icon, href }) => {
        const isActive = pathname === href;
        return (
          <motion.button
            key={id}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-1 p-2 focus:outline-none"
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
  );
}
