"use client";

import { useRouter } from "next/navigation";
import CardIssueScreen from "../components/CardIssueScreen";

export default function CardAddPage() {
  const router = useRouter();
  return <CardIssueScreen onIssue={() => router.push("/card/add/apply")} />;
}