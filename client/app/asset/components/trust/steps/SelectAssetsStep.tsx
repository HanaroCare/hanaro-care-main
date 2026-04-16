import {
  getAssetDashboard,
  getFinancialAssets,
  getInsuranceAssets,
} from '@/app/asset/actions/asset';
import SelectAssetsStepClient, {
  type AssetItem,
} from './SelectAssetsStepClient';

export default async function SelectAssetsStep() {
  const [financialAssetsResult, insuranceAssetsResult, dashboardResult] =
    await Promise.allSettled([
      getFinancialAssets(),
      getInsuranceAssets(),
      getAssetDashboard(),
    ]);

  if (
    financialAssetsResult.status === 'rejected' ||
    insuranceAssetsResult.status === 'rejected' ||
    dashboardResult.status === 'rejected'
  ) {
    return <SelectAssetsStepClient items={[]} /* hasLoadError */ />;
  }

  const financialAssets = financialAssetsResult.value;
  const insuranceAssets = insuranceAssetsResult.value;
  const dashboard = dashboardResult.value;

  const cashAmount = financialAssets
    .filter((a) => a.assetCateCd === 'CASH')
    .reduce((sum, a) => sum + a.balanceAmt, 0);

  const insuranceAmount = insuranceAssets.reduce((sum, a) => sum + a.amount, 0);

  const realEstateAmount = (dashboard?.realAssets ?? [])
    .filter((a) => a.assetCateCd === 'REAL_ESTATE')
    .reduce((sum, a) => sum + (a.evalAmt ?? 0), 0);

  const items: AssetItem[] = [
    { id: 'cash', title: '현금 / 예금', rawAmount: cashAmount },
    { id: 'insurance', title: '보험 해지환급금', rawAmount: insuranceAmount },
    { id: 'realestate', title: '부동산', rawAmount: realEstateAmount },
  ].filter((item) => item.rawAmount > 0);

  return <SelectAssetsStepClient items={items} />;
}
