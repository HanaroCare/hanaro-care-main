"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Route } from "next";
import Header from "@/components/navigation/Header";

type Tab = "local" | "hana";

interface SupportItem {
    id: number;
    title: string;
    description: string;
    tab: Tab;
}

const supportItems: SupportItem[] = [
    { id: 1, title: "돌봄플러스 케어", description: "65세 이상 독거노인 대상 맞춤형 돌봄 서비스입니다. 주 3회 방문 케어를 제공합니다.", tab: "local" },
    { id: 2, title: "노인 맞춤 돌봄", description: "일상생활 지원이 필요한 어르신에게 안전지원, 사회참여 서비스를 제공합니다.", tab: "local" },
    { id: 3, title: "치매안심센터 지원", description: "치매 조기 검진 및 예방, 치매 환자 및 가족 지원 서비스를 제공합니다.", tab: "local" },
    { id: 4, title: "노인 의료비 지원", description: "저소득 어르신 대상 의료비 본인부담금 지원 서비스입니다.", tab: "local" },
    { id: 5, title: "하나 더 넥스트 케어", description: "하나은행 고객 대상 프리미엄 시니어 케어 서비스입니다.", tab: "hana" },
    { id: 6, title: "하나 시니어 클럽", description: "60세 이상 하나은행 고객을 위한 맞춤형 금융·생활 서비스입니다.", tab: "hana" },
];

export default function SupportPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("local");

    const filtered = supportItems.filter((item) => item.tab === activeTab);

    return (
        <div className="w-full min-h-screen bg-white flex flex-col overflow-x-hidden">
            <Header title="나를 위한 제도" onBack={() => router.push("/my" as Route)} />

            {/* 탭 영역: 회색 배경 삭제, 깔끔한 버튼 스타일 */}
            <div className="px-[20px] pt-[20px] pb-[10px] sticky top-[56px] bg-white z-10">
                <div className="flex flex-row w-full gap-2">
                    <button
                        onClick={() => setActiveTab("local")}
                        className={`flex-1 py-[12px] rounded-[14px] transition-all duration-200 font-bold text-[16px] ${
                            activeTab === "local"
                                ? "bg-hana-green-50 text-hana-green-700"
                                : "bg-white text-hana-black-500 hover:bg-gray-50"
                        }`}
                    >
                        지자체
                    </button>

                    <button
                        onClick={() => setActiveTab("hana")}
                        className={`flex-1 py-[12px] rounded-[14px] transition-all duration-200 font-bold text-[16px] ${
                            activeTab === "hana"
                                ? "bg-hana-green-50 text-hana-green-700"
                                : "bg-white text-hana-black-500 hover:bg-gray-50"
                        }`}
                    >
                        하나 the next
                    </button>
                </div>
            </div>

            <main className="flex-1">
                <div
                    key={activeTab}
                    className="flex flex-col gap-[12px] px-[20px] pt-[10px] pb-[40px] animate-fade-up"
                >
                    {filtered.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => router.push(`/future/support/detail/${item.id}` as Route)}
                            className="group flex flex-row items-center justify-between w-full p-[20px] rounded-[24px] text-left transition-all active:scale-[0.97] bg-hana-silver-50"
                        >
                            <div className="flex flex-col gap-[6px] flex-1 pr-[12px]">
                                {/* 상단 작은 태그 */}
                                <div className="w-fit px-[10px] py-[2px] rounded-full bg-white text-hana-green-700 text-[11px] font-bold mb-1">
                                    {activeTab === "local" ? "공공" : "시니어"}
                                </div>
                                <span className="font-bold text-[19px] leading-[26px] text-hana-black-900 tracking-snug">
                  {item.title}
                </span>
                                <span className="font-medium text-[13px] leading-[20px] text-hana-black-500 line-clamp-2">
                  {item.description}
                </span>
                            </div>

                            <div className="flex items-center justify-center w-[36px] h-[36px] rounded-full bg-white shadow-sm group-active:translate-x-1 transition-transform">
                                <ChevronRight size={25} className="text-hana-green-700" />
                            </div>
                        </button>
                    ))}
                </div>
            </main>

            <style jsx global>{`
                @keyframes fade-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-up {
                    animation: fade-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
