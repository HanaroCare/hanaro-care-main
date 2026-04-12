"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import PrimaryButton from "@/components/PrimaryButton";

export default function SignupCompleted() {
  const router = useRouter();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-[2rem] text-center">
      <motion.div initial={{ scale: 0.5, y: 30 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.2 }} className="mb-[3rem] flex h-[10rem] w-[10rem] items-center justify-center rounded-full bg-hana-ez-50">
        <CheckCircle2 className="h-[4.5rem] w-[4.5rem] text-hana-ez-600" strokeWidth={2.5} />
      </motion.div>
      <h2 className="text-[1.75rem] font-bold text-gray-900 mb-[1rem] leading-tight tracking-tight">가입이 완료되었어요!</h2>
      <p className="text-[1.125rem] text-gray-500 mb-[4rem] leading-relaxed">이제 하나케어의 특별한{"\n"}자산 관리 서비스를 시작해보세요.</p>
      <div className="w-full max-w-[18.75rem]">
        <PrimaryButton label="시작하기" onClick={() => router.push("/")} className="shadow-2xl shadow-hana-ez-600/20" />
      </div>
    </motion.div>
  );
}
