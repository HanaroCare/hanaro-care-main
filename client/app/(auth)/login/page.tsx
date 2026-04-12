"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import LoginHeader from "./components/LoginHeader";
import SimplePasswordAuth from "./components/SimplePasswordAuth";
import FaceIdAuth from "./components/FaceIdAuth";
import PatternAuth from "./components/PatternAuth";
import LoginMethodDrawer from "./components/LoginMethodDrawer";
import PrimaryButton from "@/components/PrimaryButton";

export default function LoginPage() {
    const router = useRouter();
    const [authMode, setAuthMode] = useState<"password" | "faceid" | "pattern">("password");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const titles = {
        password: "간편비밀번호 로그인",
        faceid: "Face ID 로그인",
        pattern: "패턴 로그인"
    };

    const handleLogin = useCallback(() => {
        console.log(`Login successful via ${authMode}`);
        router.push("/");
    }, [authMode, router]);

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <LoginHeader title={titles[authMode]} />

            <main className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={authMode}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="h-full px-[1.5rem]"
                    >
                        {authMode === "password" && <SimplePasswordAuth />}
                        {authMode === "faceid" && <FaceIdAuth onSuccess={handleLogin} />}
                        {authMode === "pattern" && <PatternAuth />}
                    </motion.div>
                </AnimatePresence>
            </main>

            <footer className="flex flex-col gap-[1.25rem] p-[1.5rem] pb-[3.5rem]">
                <button
                    type="button"
                    onClick={() => setIsDrawerOpen(true)}
                    className="mx-auto text-[0.875rem] font-medium text-hana-black-500 underline underline-offset-4"
                >
                    다른 방법으로 로그인
                </button>

                {authMode !== "faceid" && (
                    <PrimaryButton
                        label="로그인"
                        onClick={handleLogin}
                    />
                )}
            </footer>

            <LoginMethodDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                onSelect={(mode) => setAuthMode(mode)}
            />
        </div>
    );
}
