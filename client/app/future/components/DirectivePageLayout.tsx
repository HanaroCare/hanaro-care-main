"use client";

import Header from "@/components/navigation/Header";
import DotIndicator from "@/app/future/components/DotIndicator";
import { ReactNode } from "react";

interface Props {
    step: number;
    question: string;
    children: ReactNode;
    footer: ReactNode;
}

export default function DirectivePageLayout({ step, question, children, footer }: Props) {
    return (
        <div className="flex flex-col min-h-[100dvh] bg-white">
            <Header title="연명의료 결정" />

            <main className="flex-1 flex flex-col px-[25px]">
                <div className="flex justify-center mt-[40px]">
                    <DotIndicator total={3} current={step} />
                </div>

                <h2 className="mt-[48px] font-bold text-[24px] leading-[36px] tracking-[-0.02em] text-[#1A212D] whitespace-pre-line">
                    {question}
                </h2>

                <div className="flex-1 mt-[32px]">
                    {children}
                </div>
            </main>

            <footer className="px-[25px] pb-[40px] flex flex-col gap-[12px]">
                {footer}
            </footer>
        </div>
    );
}
