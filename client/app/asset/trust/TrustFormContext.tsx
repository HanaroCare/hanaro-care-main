'use client';

import { createContext, useContext, useMemo, useState } from 'react';

export type StartTimingValue = 'now' | 'when-needed' | 'custom-date';
export type OperationTypeValue = 'managed' | 'self';
export type PayoutTypeValue = 'free' | 'pension';
export type PayoutItemValue = 'hospital' | 'living';

export type PayoutAmounts = {
  hospital: number;
  living: number;
};

export type TrustFormState = {
  selectedAssets: string[];
  principalAmount: number;
  startTiming: StartTimingValue | null;
  startDate: string | null;
  operationType: OperationTypeValue;
  payoutType: PayoutTypeValue | null;
  payoutItems: PayoutItemValue[];
  payoutAmounts: PayoutAmounts;
  selectedAgent: number | null;
};

type TrustFormContextValue = {
  form: TrustFormState;
  setSelectedAssets: (ids: string[], total: number) => void;
  setStartTiming: (
    startTiming: StartTimingValue | null,
    startDate?: string | null,
  ) => void;
  setOperationType: (operationType: OperationTypeValue) => void;
  setPayoutType: (payoutType: PayoutTypeValue | null) => void;
  setPayoutItems: (
    payoutItems: PayoutItemValue[],
    payoutAmounts?: Partial<PayoutAmounts>,
  ) => void;
  setSelectedAgent: (selectedAgent: number | null) => void;
  resetForm: () => void;
};

const initialFormState: TrustFormState = {
  selectedAssets: [],
  principalAmount: 0,
  startTiming: null,
  startDate: null,
  operationType: 'managed',
  payoutType: null,
  payoutItems: [],
  payoutAmounts: {
    hospital: 0,
    living: 0,
  },
  selectedAgent: null,
};

const TrustFormContext = createContext<TrustFormContextValue | null>(null);

export function TrustFormProvider({ children }: { children: React.ReactNode }) {
  const [form, setForm] = useState<TrustFormState>(initialFormState);

  const value = useMemo<TrustFormContextValue>(
    () => ({
      form,

      setSelectedAssets: (ids, total) => {
        setForm((prev) => ({
          ...prev,
          selectedAssets: ids,
          principalAmount: total,
        }));
      },

      setStartTiming: (startTiming, startDate = null) => {
        setForm((prev) => ({
          ...prev,
          startTiming,
          startDate: startTiming === 'custom-date' ? startDate : null,
        }));
      },

      setOperationType: (operationType) => {
        setForm((prev) => ({
          ...prev,
          operationType,
        }));
      },

      setPayoutType: (payoutType) => {
        setForm((prev) => ({
          ...prev,
          payoutType,
          payoutItems: payoutType === 'free' ? prev.payoutItems : [],
          payoutAmounts:
            payoutType === 'free'
              ? prev.payoutAmounts
              : { hospital: 0, living: 0 },
        }));
      },

      setPayoutItems: (payoutItems, payoutAmounts = {}) => {
        setForm((prev) => {
          const nextAmounts = {
            ...prev.payoutAmounts,
            ...payoutAmounts,
          };

          return {
            ...prev,
            payoutItems,
            payoutAmounts: {
              hospital: payoutItems.includes('hospital')
                ? nextAmounts.hospital
                : 0,
              living: payoutItems.includes('living') ? nextAmounts.living : 0,
            },
          };
        });
      },

      setSelectedAgent: (selectedAgent) => {
        setForm((prev) => ({
          ...prev,
          selectedAgent,
        }));
      },

      resetForm: () => {
        setForm(initialFormState);
      },
    }),
    [form],
  );

  return (
    <TrustFormContext.Provider value={value}>
      {children}
    </TrustFormContext.Provider>
  );
}

export function useTrustForm() {
  const context = useContext(TrustFormContext);

  if (!context) {
    throw new Error('useTrustForm must be used within TrustFormProvider');
  }

  return context;
}
