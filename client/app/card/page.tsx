import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getMyCards, getCardUsages, getCardBalance } from "./actions/card";
import CardDashboardScreen from "./components/CardDashboardScreen";

export default async function CardPage() {
  const cards = await getMyCards().catch(() => []);

  if (cards.length === 0) {
    redirect("/card/add");
  }

  const [usages, balance] = await Promise.all([
    getCardUsages(cards[0].cardId).catch(() => []),
    getCardBalance(cards[0].cardId).catch(() => 0),
  ]);

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          카드 정보를 불러오는 중...
        </div>
      }
    >
      <CardDashboardScreen cards={cards} usages={usages} balance={balance} />
    </Suspense>
  );
}
