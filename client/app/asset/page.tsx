import { AssetChangeChart } from './component/AssetChangeChart';
import { AssetListCard } from './component/AssetListCard';
import { AssetTabNavigation } from './component/AssetTabNavigation';

export default function Home() {
  return (
    <>
      <AssetTabNavigation />
      <main className="flex flex-col items-center gap-6 px-6 pt-6 pb-[100px]">
        <AssetListCard />
        <AssetChangeChart />
      </main>
    </>
  );
}
