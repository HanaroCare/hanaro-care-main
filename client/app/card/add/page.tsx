"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CardIssueScreen from "../components/CardIssueScreen";
import CardConsentPage from "./consent/page";
import { Route } from "next";
import Header from "@/components/navigation/Header";

export default function CardAddPage() {
  const router = useRouter();
  const [selectedDesignId, setSelectedDesignId] = useState<number | null>(null);

  if (selectedDesignId !== null) {
    return (
      <CardConsentPage
        onComplete={() =>
          router.push(`/card/add/apply?designId=${selectedDesignId}` as Route)
        }
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header title="돌봄지갑 개설" />
      <CardIssueScreen onIssue={(designId) => setSelectedDesignId(designId)} />
    </div>
  );
}
