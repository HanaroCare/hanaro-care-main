"use client";

import LoginHeader from "@/components/LoginHeader";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FaceIdAuth from "../components/FaceIdAuth";
import PatternAuth from "../components/PatternAuth";
import SimplePasswordAuth from "../components/SimplePasswordAuth";

type AuthMode = "pattern" | "pin" | "faceid";

/**
 * 하나인증서 간편 로그인 페이지
 */
export default function HanaCertLoginPage() {
    const router = useRouter();
    const [authMode, setAuthMode] = useState<AuthMode>("pattern");

    const handleAuthSuccess = () => {
        // 실제로는 인증 성공 후 토큰 처리 등을 수행
        router.push("/");
    };

    return (
        <div className="app-shell bg-background">
            <div className="app-layout">
                <LoginHeader title="하나인증서 로그인" />

                <main className="app-main flex flex-col">
                    <div className="flex w-full border-b border-border">
                        <button
                            type="button"
                            onClick={() => setAuthMode("pattern")}
                            className={`flex-1 py-[1rem] text-[0.875rem] font-semibold transition-colors ${authMode === "pattern"
                                ? "border-b-2 border-primary text-primary"
                                : "text-muted-foreground"
                                }`}
                        >
                            패턴
                        </button>
                        <button
                            type="button"
                            onClick={() => setAuthMode("pin")}
                            className={`flex-1 py-[1rem] text-[0.875rem] font-semibold transition-colors ${authMode === "pin"
                                ? "border-b-2 border-primary text-primary"
                                : "text-muted-foreground"
                                }`}
                        >
                            간편비밀번호
                        </button>
                        <button
                            type="button"
                            onClick={() => setAuthMode("faceid")}
                            className={`flex-1 py-[1rem] text-[0.875rem] font-semibold transition-colors ${authMode === "faceid"
                                ? "border-b-2 border-primary text-primary"
                                : "text-muted-foreground"
                                }`}
                        >
                            Face ID
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-[1.5rem]">
                        {authMode === "pattern" && <PatternAuth />}
                        {authMode === "pin" && <SimplePasswordAuth />}
                        {authMode === "faceid" && (
                            <FaceIdAuth onSuccess={handleAuthSuccess} />
                        )}
                    </div>

                    {authMode !== "faceid" && (
                        <div className="p-[1.5rem] pb-[3rem]">
                            <button
                                type="button"
                                onClick={handleAuthSuccess}
                                className="h-[3.5rem] w-full rounded-[0.75rem] bg-primary text-[1.0625rem] font-bold text-white transition-all active:scale-[0.98] hover:bg-primary/90"
                            >
                                인증완료
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
