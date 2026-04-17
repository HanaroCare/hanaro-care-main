import { getCardUsageDetail } from "../../actions/card";
import CardUsageDetailClient from "../components/CardUsageDetailClient";

export default async function CardUsageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const usage = await getCardUsageDetail(id).catch(() => null);
  return <CardUsageDetailClient usage={usage} />;
}
