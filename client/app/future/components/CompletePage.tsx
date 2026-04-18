"use client";

import { useRouter } from "next/navigation";
import { Printer, FileText } from "lucide-react";
import { Route } from "next";
import Image from "next/image";
import CompleteStep from "@/components/modules/CompleteStep";

interface CompletePageProps {
    confirmHref: Route;
    documentDownloadSrc?: string;
    registerHref?: string;
}

export default function CompletePage({
                                         confirmHref,
                                         documentDownloadSrc,
                                         registerHref,
                                     }: CompletePageProps) {
    const router = useRouter();

    return (
        <div className="w-full h-dvh overflow-hidden bg-white">
            <CompleteStep
                icon={
                    <div className="relative w-[180px] h-[180px]">
                        <Image
                            src="/images/future/result.png"
                            alt="작성 완료"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                }
                footer={
                    <div className="flex flex-col gap-[12px] w-full px-6 pb-[40px]">
                        <button
                            type="button"
                            onClick={() => router.push(confirmHref)}
                            className="w-full h-[56px] rounded-[12px] font-semi-bold text-[17px] text-white active:opacity-90"
                            style={{ backgroundColor: "#01A5AC" }}
                        >
                            확인
                        </button>

                        <div className="flex flex-row gap-[10px]">
                            {documentDownloadSrc ? (
                                <a
                                    href={documentDownloadSrc}
                                    download
                                    className="flex flex-row items-center justify-center gap-[6px] flex-1 h-[52px] rounded-[12px] border border-[#01A5AC] bg-white active:bg-gray-50"
                                >
                                    <Printer size={18} color="#01A5AC" />
                                    <span className="font-semi-bold text-[14px] text-[#01A5AC]">
                    서류 다운로드
                  </span>
                                </a>
                            ) : (
                                <button
                                    type="button"
                                    disabled
                                    className="flex flex-row items-center justify-center gap-[6px] flex-1 h-[52px] rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] cursor-not-allowed text-[#9CA3AF]"
                                >
                                    <Printer size={18} />
                                    <span className="font-semi-bold text-[14px]">서류 다운로드</span>
                                </button>
                            )}

                            {registerHref ? (
                                <button
                                    type="button"
                                    onClick={() => window.open(registerHref, "_blank", "noopener,noreferrer")}
                                    className="flex flex-row items-center justify-center gap-[6px] flex-1 h-[52px] rounded-[12px] border border-[#01A5AC] bg-white active:bg-gray-50"
                                >
                                    <FileText size={18} color="#01A5AC" />
                                    <span className="font-semi-bold text-[14px] text-[#01A5AC]">
                    등록하러 가기
                  </span>
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    disabled
                                    className="flex flex-row items-center justify-center gap-[6px] flex-1 h-[52px] rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] cursor-not-allowed text-[#9CA3AF]"
                                >
                                    <FileText size={18} />
                                    <span className="font-semi-bold text-[14px]">등록하러 가기</span>
                                </button>
                            )}
                        </div>
                    </div>
                }
            >
                <div className="flex flex-col items-center">
                    <h2 className="text-[26px] font-semi-bold leading-tight tracking-tight text-[#1A212D] text-center">
                        작성이 완료되었습니다.
                    </h2>
                </div>
            </CompleteStep>
        </div>
    );
}
