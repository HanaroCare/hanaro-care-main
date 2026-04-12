'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

type ExpenseBreakdown = {
  label: string;
  amount: string;
  progress: number;
  color: string;
};

type ExpenseItem = {
  range: string;
  totalAmount: string;
  breakdown: ExpenseBreakdown[];
};

const MOCK_EXPENSES: ExpenseItem[] = [
  {
    range: '65세 - 70세',
    totalAmount: '150만원',
    breakdown: [
      {
        label: '생활비',
        amount: '80만원',
        progress: 1.0,
        color: 'var(--color-hana-ez-600)',
      },
      {
        label: '병원비',
        amount: '40만원',
        progress: 0.5,
        color: 'var(--color-hana-blue-500)',
      },
      {
        label: '요양비',
        amount: '30만원',
        progress: 0.35,
        color: 'var(--color-hana-teal-500)',
      },
    ],
  },
  {
    range: '70세 - 75세',
    totalAmount: '150만원',
    breakdown: [
      {
        label: '생활비',
        amount: '70만원',
        progress: 0.85,
        color: 'var(--color-hana-ez-600)',
      },
      {
        label: '병원비',
        amount: '50만원',
        progress: 0.65,
        color: 'var(--color-hana-blue-500)',
      },
      {
        label: '요양비',
        amount: '30만원',
        progress: 0.35,
        color: 'var(--color-hana-teal-500)',
      },
    ],
  },
  {
    range: '75세 - 80세',
    totalAmount: '150만원',
    breakdown: [
      {
        label: '생활비',
        amount: '60만원',
        progress: 0.75,
        color: 'var(--color-hana-ez-600)',
      },
      {
        label: '병원비',
        amount: '60만원',
        progress: 0.75,
        color: 'var(--color-hana-blue-500)',
      },
      {
        label: '요양비',
        amount: '30만원',
        progress: 0.35,
        color: 'var(--color-hana-teal-500)',
      },
    ],
  },
  {
    range: '80세 - 85세',
    totalAmount: '150만원',
    breakdown: [
      {
        label: '생활비',
        amount: '50만원',
        progress: 0.65,
        color: 'var(--color-hana-ez-600)',
      },
      {
        label: '병원비',
        amount: '70만원',
        progress: 0.85,
        color: 'var(--color-hana-blue-500)',
      },
      {
        label: '요양비',
        amount: '30만원',
        progress: 0.35,
        color: 'var(--color-hana-teal-500)',
      },
    ],
  },
];

export function SimulationExpenseAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex w-full flex-col gap-4">
      {MOCK_EXPENSES.map((item, index) => (
        <div
          key={item.range}
          className="overflow-hidden rounded-[20px] border border-hana-silver-100 bg-white shadow-sm"
        >
          <button
            type="button"
            className="flex w-full items-center justify-between px-6 py-[22px] transition-colors active:bg-hana-silver-50"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <span className="font-medium text-[17px] text-hana-black-500">
              {item.range}
            </span>
            <div className="flex items-center gap-3">
              <span className="font-bold text-[18px] text-hana-red-500">
                {item.totalAmount}
              </span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={22} className="text-hana-silver-200" />
              </motion.div>
            </div>
          </button>

          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <div className="flex flex-col gap-6 border-hana-silver-100 border-t px-6 py-8">
                  {item.breakdown.map((b) => (
                    <div key={b.label} className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[15px] text-hana-black-500">
                          {b.label}
                        </span>
                        <span className="font-bold text-[17px] text-hana-red-500">
                          {b.amount}
                        </span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-hana-silver-100">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${b.progress * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: b.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
