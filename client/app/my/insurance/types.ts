export type Screen = 'family' | 'main' | 'detail';

export interface InsuranceItem {
  id: number;
  company: string;
  name: string;
  subLabel?: string;
  monthlyPremium: string;
  needsConfirm?: boolean;
}

export interface InsuranceDetail {
  id: number;
  company: string;
  name: string;
  type: string;
  subLabel?: string;
  monthlyPremium: string | null;
  contractDate: string;
  expiryDate: string;
}
