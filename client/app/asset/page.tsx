import { NavigationBar } from '@/components/NavigationBar';
import { AssetChangeChart } from './component/AssetChangeChart';
import { AssetListCard } from './component/AssetListCard';
import { AssetSummaryHeader } from './component/AssetSummaryHeader';
import { AssetTabNavigation } from './component/AssetTabNavigation';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <div className="sticky top-0 z-50 bg-white">
        <AssetTabNavigation />
        <AssetSummaryHeader totalAmount={'10억 3700만원'} />
      </div>
      <main className="flex flex-col items-center gap-6 px-6 pt-6 pb-[100px]">
        <AssetListCard />
        <AssetChangeChart />
      </main>
      <NavigationBar />
    </div>
  );
}
