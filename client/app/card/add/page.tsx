"use client";

import { useRouter } from "next/navigation";
import CardIssueScreen from "../components/CardIssueScreen";
import { Route } from "next";

export default function CardAddPage() {
  const router = useRouter();
  return (
    <CardIssueScreen
      onIssue={(designId) =>
        router.push(`/card/add/apply?designId=${designId}` as Route)
      }
    />
  );
}
