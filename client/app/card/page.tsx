"use client";

import { useCard } from "./hooks/useCard";
import CardIssueScreen from "./components/Cardissuesscreen";
import CardDashboardScreen from "./components/Carddashboardscreen";

export default function CardPage() {
  const { card, usages, showIssue, setShowIssue, issueCard } = useCard();

  if (!card || showIssue) {
    return <CardIssueScreen onIssue={issueCard} />;
  }

  return (
    <CardDashboardScreen
      card={card}
      usages={usages}
      onAddCard={() => setShowIssue(true)}
    />
  );
}
