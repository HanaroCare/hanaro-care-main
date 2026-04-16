"use client";

import Header from "@/components/navigation/Header";
import CompletePage from "@/app/future/components/CompletePage";
import { Route } from "next";

export default function AdvanceDirectiveCompletePage() {
  return (
    <>
      <Header title="연명의료 결정" />
      <CompletePage confirmHref={"/future/advance-directive" as Route} />
    </>
  );
}
