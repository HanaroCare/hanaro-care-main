import { getInsuranceDetail } from "@/app/my/actions/insuranceActions";
import InsuranceDetail from "@/app/my/insurance/components/InsuranceDetail";


export default async function MyFamilyInsuranceDetailPage({
    params,
}: {
    params: Promise<{ insuranceId: string }>;
}) {
    const detail = await getInsuranceDetail((await params).insuranceId);

    if (!detail) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-gray-400 text-sm">
                    보험 정보를 불러오지 못했습니다.
                </p>
            </div>
        );
    }

    return <InsuranceDetail detail={detail} />;
}
