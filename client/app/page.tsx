import { NavigationBar } from '@/components/NavigationBar';
import { FinancialAssetCard } from './asset/component/FinancialAssetCard';
import { MedicalBillCard } from './asset/component/MedicalBillCard';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6 font-sans">
      <MedicalBillCard />
      <FinancialAssetCard />
      <NavigationBar />
    </div>
  );
}
