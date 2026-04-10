import { NavigationBar } from '@/components/NavigationBar';
import { AssetDashboard } from './asset/component/AssetDashboard';
import { MedicalBillCard } from './asset/component/MedicalBillCard';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6 font-sans">
      <MedicalBillCard />
      <AssetDashboard />
      <NavigationBar />
    </div>
  );
}
