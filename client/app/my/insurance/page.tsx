import { getInsurances } from '../actions/insuranceActions';
import InsuranceList from './components/InsuranceList';

export default async function MyFamilyInsurancePage() {
  try {
    const data = await getInsurances();

    if (!data) {
      return (
        <div className="py-20 text-center text-red-400">데이터가 없습니다.</div>
      );
    }

    return (
      <InsuranceList
        initialInsurances={data.insurances}
        initialIsInsAgent={data.isInsAgent}
      />
    );
  } catch (error) {
    return (
      <div className="py-20 text-center text-red-400">
        데이터 로드에 실패했습니다.
      </div>
    );
  }
}
