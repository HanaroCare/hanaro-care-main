import type { GuardianData } from '../types';

export type StepProps = {
  data?: GuardianData;
  onChange?: (u: Partial<GuardianData>) => void;
  onNext: () => void;
  onPrev?: () => void;
  goTo?: (step: number) => void;
};

export type Notary = {
  name: string;
  address: string;
  distance: string;
  phone: string;
  lat: number;
  lng: number;
};
