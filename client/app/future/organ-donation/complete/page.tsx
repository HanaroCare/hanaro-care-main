"use client";

import Header from "@/components/navigation/Header";
import CompletePage from "@/app/future/components/CompletePage";
import { Route } from "next";

export default function OrganDonationCompletePage() {
  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col">
      <Header title="새생명 나눔" />
      <CompletePage
        confirmHref={"/future/organ-donation" as Route}
        documentDownloadSrc="/images/future/organ.png"
        registerHref="https://www.konos.go.kr/page/subPage.do?page=sub2_1_1"
      />
    </div>
  );
}
