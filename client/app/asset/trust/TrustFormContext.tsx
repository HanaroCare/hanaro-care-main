'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type PayoutAmounts = {
  hospital: number;
  living: number;
};

export type TrustFormState = {
  // Step 1
  selectedAssets: string[];
  principalAmount: number;
  // Step 2
  startTiming: string | null;
  startDate: string | null;
  // Step 3
  operationType: string;
  // Step 4
  payoutType: string | null;
  // Step 5
  payoutItems: string[];
  payoutAmounts: PayoutAmounts;
  // Step 6
  selectedAgent: string | null;
};

type TrustFormContextValue = {
  form: TrustFormState;
  setSelectedAssets: (ids: string[], amount: number) => void;
  setStartTiming: (timing: string, date?: string | null) => void;
  setOperationType: (type: string) => void;
  setPayoutType: (type: string) => void;
  setPayoutItems: (items: string[], amounts: PayoutAmounts) => void;
  setSelectedAgent: (agentId: string | null) => void;
};

const TrustFormContext = createContext<TrustFormContextValue | null>(null);

const initialState: TrustFormState = {
  selectedAssets: [],
  principalAmount: 0,
  startTiming: null,
  startDate: null,
  operationType: 'managed',
  payoutType: 'free',
  payoutItems: ['hospital', 'living'],
  payoutAmounts: { hospital: 430000, living: 1000000 },
  selectedAgent: null,
};

export function TrustFormProvider({ children }: { children: ReactNode }) {
  const [form, setForm] = useState<TrustFormState>(initialState);

  const setSelectedAssets = useCallback((ids: string[], amount: number) => {
    setForm((prev) => ({ ...prev, selectedAssets: ids, principalAmount: amount }));
  }, []);

  const setStartTiming = useCallback((timing: string, date?: string | null) => {
    setForm((prev) => ({ ...prev, startTiming: timing, startDate: date ?? null }));
  }, []);

  const setOperationType = useCallback((type: string) => {
    setForm((prev) => ({ ...prev, operationType: type }));
  }, []);

  const setPayoutType = useCallback((type: string) => {
    setForm((prev) => ({ ...prev, payoutType: type }));
  }, []);

  const setPayoutItems = useCallback((items: string[], amounts: PayoutAmounts) => {
    setForm((prev) => ({ ...prev, payoutItems: items, payoutAmounts: amounts }));
  }, []);

  const setSelectedAgent = useCallback((agentId: string | null) => {
    setForm((prev) => ({ ...prev, selectedAgent: agentId }));
  }, []);

  const value = useMemo(
    () => ({
      form,
      setSelectedAssets,
      setStartTiming,
      setOperationType,
      setPayoutType,
      setPayoutItems,
      setSelectedAgent,
    }),
    [form, setSelectedAssets, setStartTiming, setOperationType, setPayoutType, setPayoutItems, setSelectedAgent],
  );

  return (
    <TrustFormContext.Provider value={value}>
      {children}
    </TrustFormContext.Provider>
  );
}

export function useTrustForm() {
  const ctx = useContext(TrustFormContext);
  if (!ctx) throw new Error('useTrustForm must be used inside TrustFormProvider');
  return ctx;
}
