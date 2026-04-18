"use server";

import { serverFetch } from "@/lib/serverFetch";
import { CardData, UsageData } from "../hooks/useCard";

export async function getMyCards(): Promise<CardData[]> {
  return await serverFetch<CardData[]>("/api/cards");
}

export async function getCardUsages(cardId: string): Promise<UsageData[]> {
  return await serverFetch<UsageData[]>(`/api/cards/${cardId}/usages`);
}

export async function getCardBalance(cardId: string): Promise<number> {
  return await serverFetch<number>(`/api/cards/${cardId}/balance`);
}

export interface Account {
  accountId: string;
  instNm: string;
  accountNum: string;
  balanceAmt: number;
}

export interface CardUpdateRequest {
  autoTransAmt: number;
  accountId: string;
  payDay: number;
}

export async function getCardAccounts(): Promise<Account[]> {
  return await serverFetch<Account[]>("/api/cards/accounts");
}

export async function updateCardSettings(
  cardId: string,
  data: CardUpdateRequest,
): Promise<void> {
  await serverFetch<void>(`/api/cards/${cardId}/settings`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function cancelCard(cardId: string): Promise<void> {
  await serverFetch<void>(`/api/cards/${cardId}/cancel`, {
    method: "PATCH",
  });
}

export async function getCardById(cardId: string): Promise<CardData | null> {
  const cards = await getMyCards().catch(() => []);
  return cards.find((c) => c.cardId === cardId) ?? null;
}

export interface ChargeRequest {
  cardId: string;
  chargeAmt: number;
  accountId: string;
}

export async function chargeCard(data: ChargeRequest): Promise<void> {
  await serverFetch<void>("/api/cards/charge", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export interface FamilyMemberResponse {
  familyAuthId: string;
  granteeId: string;
  userNm: string;
  relationCd: string;
}

export interface RegisterCardRequest {
  accountId: string;
  cardNm: string;
  limitAmt: number;
  autoTransAmt: number;
  designCd: string;
  familyAuthIds: string[];
  payDay: number;
}

export async function getFamilyMembers(): Promise<FamilyMemberResponse[]> {
  return await serverFetch<FamilyMemberResponse[]>("/api/cards/family");
}

export async function registerCard(data: RegisterCardRequest): Promise<void> {
  await serverFetch<void>("/api/cards", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export interface CardUsageDetail {
  cardId: string;
  cardUsageId: string;
  usageNm: string;
  usageLoc: string;
  usageTypeCd: string;
  usageAmt: number;
  abnmlYn: string;
  aprvlYn: string;
  createdAt: string;
}

export async function getCardUsageDetail(
  usageId: string,
): Promise<CardUsageDetail> {
  return await serverFetch<CardUsageDetail>(`/api/cards/usages/${usageId}`);
}
