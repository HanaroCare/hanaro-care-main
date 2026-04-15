import type { ReactNode } from 'react';
import { TrustFormProvider } from '@/app/asset/trust/TrustFormContext';

export default function TrustStepLayout({ children }: { children: ReactNode }) {
  return <TrustFormProvider>{children}</TrustFormProvider>;
}
