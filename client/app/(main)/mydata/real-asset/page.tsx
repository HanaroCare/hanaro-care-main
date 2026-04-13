"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import LoginHeader from "../../../../components/LoginHeader";
import AssetTypeSelector from "./components/AssetTypeSelector";
import HouseSection from "./components/HouseSection";
import CarSection from "./components/CarSection";
import GoldSection from "./components/GoldSection";

export type AssetType = "house" | "car" | "gold";
export type Step = "form" | "result";

/**
 * 실물 자산(부동산, 자동차, 금) 조회 및 등록 메인 페이지
 */
export default function RealAssetPage() {
  const router = useRouter();
  const [assetType, setAssetType] = useState<AssetType>("house");
  const [step, setStep] = useState<Step>("form");

  const getTitle = () => {
    const titles = { house: "부동산", car: "자동차", gold: "금" };
    return `${titles[assetType]} 조회`;
  };

  const handleBack = () => {
    if (step === "result") {
      setStep("form");
    } else {
      router.back();
    }
  };

  return (
    <div className="app-shell bg-background">
      <div className="app-layout relative overflow-hidden">
        <LoginHeader 
          title={getTitle()} 
          onBack={handleBack}
          onClose={() => router.push("/asset")}
        />

        <main className="app-main flex flex-1 flex-col">
          {step === "form" && (
            <div className="px-[1.5rem] pt-[1.5rem]">
              <AssetTypeSelector 
                currentType={assetType} 
                onSelect={(type) => setAssetType(type)} 
              />
            </div>
          )}

          <div className="flex-1 flex flex-col relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${assetType}-${step}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col h-full"
              >
                {assetType === "house" && (
                  <HouseSection step={step} onComplete={() => setStep("result")} />
                )}
                {assetType === "car" && (
                  <CarSection step={step} onComplete={() => setStep("result")} />
                )}
                {assetType === "gold" && (
                  <GoldSection step={step} onComplete={() => setStep("result")} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
