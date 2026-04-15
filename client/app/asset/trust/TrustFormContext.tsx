'use client';

import { createContext, useContext, useMemo, useState } from 'react';

export type TrustFormState = {
  selectedAssets: string[];
  principalAmount: number;
  startTiming: string | null;
  startDate: string | null;
  operationType: string;
  payoutType: string | null;
  payoutItems: string[];
  payoutAmounts: {
    hospital: number;
    living: number;
  };
  selectedAgent: string | null;
};

type TrustFormContextValue = {
  form: TrustFormState;
  setSelectedAssets: (ids: string[], total: number) => void;
  setStartTiming: (
    startTiming: string | null,
    startDate?: string | null,
  ) => void;
  setOperationType: (operationType: string) => void;
  setPayoutType: (payoutType: string | null) => void;
  setPayoutItems: (
    payoutItems: string[],
    payoutAmounts?: Partial<TrustFormState['payoutAmounts']>,
  ) => void;
  setSelectedAgent: (selectedAgent: string | null) => void;
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

      // ✅ 방법 1 핵심: selectedAssets 저장할 때 principalAmount도 같이 저장
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
          startDate,
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
        }));
      },

      setPayoutItems: (payoutItems, payoutAmounts = {}) => {
        setForm((prev) => ({
          ...prev,
          payoutItems,
          payoutAmounts: {
            ...prev.payoutAmounts,
            ...payoutAmounts,
          },
        }));
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
