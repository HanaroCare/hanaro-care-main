import { getMyCards, getCardUsages } from "../actions/card";
import CardUsageClient from "./components/CardUsageClient";

export default async function CardUsagePage() {
  const cards = await getMyCards().catch(() => []);

  const usagesPerCard = await Promise.all(
    cards.map(async (card) => ({
      card,
      usages: await getCardUsages(card.cardId).catch(() => []),
    })),
  );

  return <CardUsageClient usagesPerCard={usagesPerCard} />;
}
