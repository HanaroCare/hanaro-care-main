"use client";

import { useRouter } from "next/navigation";
import { useCard } from "./hooks/useCard";
import CardDashboardScreen from "./components/CardDashboardScreen";

export default function CardPage() {
  const router = useRouter();
  const { card, usages } = useCard();

  if (!card) return null; // TODO: 백엔드 연동 시 로딩/리다이렉트 처리

  return (
    <CardDashboardScreen
      card={card}
      usages={usages}
      onAddCard={() => router.push("/card/add")}
    />
  );
}