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
      { label: '생활비', amount: '80만원', progress: 1.0, color: '#01A5AC' },
      { label: '병원비', amount: '40만원', progress: 0.5, color: '#3182F6' },
      { label: '요양비', amount: '30만원', progress: 0.35, color: '#76C1BE' },
    ],
  },
  {
    range: '70세 - 75세',
    totalAmount: '150만원',
    breakdown: [
      { label: '생활비', amount: '70만원', progress: 0.85, color: '#01A5AC' },
      { label: '병원비', amount: '50만원', progress: 0.65, color: '#3182F6' },
      { label: '요양비', amount: '30만원', progress: 0.35, color: '#76C1BE' },
    ],
  },
  {
    range: '75세 - 80세',
    totalAmount: '150만원',
    breakdown: [
      { label: '생활비', amount: '60만원', progress: 0.75, color: '#01A5AC' },
      { label: '병원비', amount: '60만원', progress: 0.75, color: '#3182F6' },
      { label: '요양비', amount: '30만원', progress: 0.35, color: '#76C1BE' },
    ],
  },
  {
    range: '85세 - 90세',
    totalAmount: '150만원',
    breakdown: [
      { label: '생활비', amount: '50만원', progress: 0.65, color: '#01A5AC' },
      { label: '병원비', amount: '70만원', progress: 0.85, color: '#3182F6' },
      { label: '요양비', amount: '30만원', progress: 0.35, color: '#76C1BE' },
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
          className="overflow-hidden rounded-[20px] border border-[#F3F4F6] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
        >
          <button
            type="button"
            className="flex w-full items-center justify-between px-6 py-[22px]"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <span className="font-medium text-[#4B5563] text-[17px]">
              {item.range}
            </span>
            <div className="flex items-center gap-3">
              <span className="font-bold text-[#E94E5A] text-[18px]">
                {item.totalAmount}
              </span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={22} className="text-[#9CA3AF]" />
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
                <div className="flex flex-col gap-6 border-[#F3F4F6] border-t px-6 py-8">
                  {item.breakdown.map((b) => (
                    <div key={b.label} className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#4B5563] text-[15px]">
                          {b.label}
                        </span>
                        <span className="font-bold text-[#E94E5A] text-[17px]">
                          {b.amount}
                        </span>
                      </div>
                      <div className="h-[10px] w-full overflow-hidden rounded-full bg-[#EAECEE]">
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
