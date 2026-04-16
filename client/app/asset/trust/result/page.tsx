import { getTrustSimulationResult } from '@/app/asset/actions/trust';
import TrustResultClient from './TrustResultClient';

export default async function TrustResultPage() {
  const result = await getTrustSimulationResult();

  if (!result) {
    return (
      <div className="app-shell bg-white">
        <div className="app-layout bg-white flex items-center justify-center">
          <p className="text-[#6A7282] text-[15px]">설계 결과를 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <TrustResultClient
      selectedDetail={result.selectedDetail}
      amountResults={result.amountResults}
    />
  );
}
