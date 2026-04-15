'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

type AgeSegmentItem = {
  range: string;
  income: number;
  expense: number;
  detail: {
    living: number;
    medical: number;
    care: number;
  };
};

type SimulationExpenseAccordionProps = {
  items: AgeSegmentItem[];
};

export function SimulationExpenseAccordion({ items }: SimulationExpenseAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const expenseItems = items.map(seg => {
    const living = Math.floor(Number(seg.detail.living) / 10000);
    const medical = Math.floor(Number(seg.detail.medical) / 10000);
    const care = Math.floor(Number(seg.detail.care) / 10000);
    const maxVal = Math.max(living, medical, care) || 1;
    return {
      range: seg.range,
      totalAmount: `${Math.floor(Number(seg.expense) / 10000)}만원`,
      breakdown: [
        { label: '생활비', amount: `${living}만원`, progress: living / maxVal, color: 'var(--color-hana-ez-600)' },
        { label: '병원비', amount: `${medical}만원`, progress: medical / maxVal, color: 'var(--color-hana-blue-500)' },
        { label: '요양비', amount: `${care}만원`, progress: care / maxVal, color: 'var(--color-hana-teal-500)' },
      ],
    };
  });

  return (
    <div className="flex w-full flex-col gap-4">
      {expenseItems.map((item, index) => (
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
