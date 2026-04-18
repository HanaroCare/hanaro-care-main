"use client";

import Header from "@/components/navigation/Header";
import CompletePage from "@/app/future/components/CompletePage";
import { Route } from "next";
import { useRouter } from "next/navigation";

export default function AdvanceDirectiveCompletePage() {
  const router = useRouter();
  return (
    <>
      <Header title="연명의료 결정" onBack={() => router.push("/my" as Route)} />
      <CompletePage
        confirmHref={"/my" as Route}
        documentDownloadSrc="/images/future/img_medicalIntent_doc_n.png"
        registerHref="https://www.lst.go.kr/addt/composableorgan.do"
      />
    </>
  );
}
