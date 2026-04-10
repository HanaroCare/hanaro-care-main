'use client';

import { motion } from 'framer-motion';
import { Home, PieChart, User, Wallet } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home', label: '홈', Icon: Home, active: true },
  { id: 'assets', label: '자산 설계', Icon: PieChart, active: false },
  { id: 'wallet', label: '돌봄 지갑', Icon: Wallet, active: false },
  { id: 'my', label: 'My하나', Icon: User, active: false },
];

export function NavigationBar() {
  return (
    <nav className="-translate-x-1/2 fixed bottom-0 left-1/2 flex h-16.25 w-full max-w-93.75 items-center justify-around bg-white px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      {NAV_ITEMS.map((item) => (
        <motion.button
          key={item.id}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center gap-1 p-2 focus:outline-none"
        >
          <div className="relative flex size-6 items-center justify-center">
            <item.Icon
              size={24}
              strokeWidth={2}
              className={
                item.active ? 'text-hana-green-700' : 'text-hana-black-400'
              }
              aria-hidden="true"
            />
          </div>
          <span
            className={`font-semi-bold text-[12px] ${
              item.active ? 'text-hana-green-700' : 'text-hana-black-400'
            }`}
          >
            {item.label}
          </span>
        </motion.button>
      ))}
    </nav>
  );
}
