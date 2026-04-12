"use client";

import { useState } from "react";
import NavigationBar from "./components/NavigationBar";
import TermsAgreement from "./components/TermsAgreement";
import PrimaryButton from "@/components/PrimaryButton";
import SignupFlowPage from "./SignupFlowPage";

const TERMS_DATA = [
    { id: "term1", label: "개인정보 수집 및 이용 동의", required: true },
    { id: "term2", label: "제3자 정보 제공 동의", required: true },
    { id: "term3", label: "고유식별정보 처리 동의", required: true },
    { id: "term4", label: "마케팅 정보 수신 동의", required: false },
];

export default function Page() {
    const [isAgreed, setIsAgreed] = useState(false);
    const [checkedIds, setCheckedIds] = useState<string[]>([]);

    const handleToggleAll = (checked: boolean) => {
        setCheckedIds(checked ? TERMS_DATA.map((t) => t.id) : []);
    };

    const handleToggleItem = (id: string) => {
        setCheckedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const requiredIds = TERMS_DATA.filter((t) => t.required).map((t) => t.id);
    const isAllRequiredChecked = requiredIds.every((id) =>
        checkedIds.includes(id)
    );

    if (isAgreed) {
        return <SignupFlowPage />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-white max-w-[23.4375rem] mx-auto shadow-sm overflow-hidden">
            <NavigationBar title="서비스 가입" />

            <main className="flex-1 px-[1.25rem] pt-[2rem] pb-[8rem]">
                <div className="mb-[2rem]">
                    <h2 className="text-[1.1rem] font-bold text-gray-900 leading-tight mb-[0.25rem]">
                        서비스 이용약관
                    </h2>
                    <p className="text-[0.75rem] font-medium text-gray-500">
                        서비스 이용을 위해 약관에 동의해주세요
                    </p>
                </div>

                <TermsAgreement
                    terms={TERMS_DATA}
                    checkedIds={checkedIds}
                    onToggleAll={handleToggleAll}
                    onToggleItem={handleToggleItem}
                />
            </main>

            <div className="fixed bottom-0 w-full max-w-[23.4375rem] bg-white p-[1.25rem] pb-[2rem]">
                <PrimaryButton
                    label="동의하고 시작하기"
                    disabled={!isAllRequiredChecked}
                    onClick={() => setIsAgreed(true)}
                />
            </div>
        </div>
    );
}
