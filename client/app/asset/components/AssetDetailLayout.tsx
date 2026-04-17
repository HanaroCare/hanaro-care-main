'use client';

import React from 'react';
import Header from '@/components/navigation/Header';
import { InfoListCard } from '@/components/modules/InfoListCard';
import { AssetChart } from './AssetChart';
import { formatKoreanCurrency } from '../utils/formatCurrency';

interface ChartConfig {
  type: 'line' | 'bar';
  color?: string;
  domain?: [number, number];
  ticks?: number[];
}

export interface InfoSection {
  title: string;
  items: { label: string; value: string }[];
}

interface AssetDetailLayoutProps {
  headerTitle: string;
  name: string;
  subtitle: string;
  amount: number;
  priceChange: number;
  changePercent: number;
  changeColorClass?: string;
  chart: {
    title: string;
    subtitle?: string;
    data: { name: string; value: number }[];
    config: ChartConfig;
  };
  sections: InfoSection[];
  footer?: React.ReactNode;
}

export function AssetDetailLayout({
  headerTitle,
  name,
  subtitle,
  amount,
  priceChange,
  changePercent,
  changeColorClass,
  chart,
  sections,
  footer,
}: AssetDetailLayoutProps) {
  const isDecrease = priceChange < 0;
  const changeIcon = isDecrease ? '▼' : '▲';
  const colorClass =
    changeColorClass ?? (isDecrease ? 'text-hana-blue-500' : 'text-hana-red-500');

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header title={headerTitle} showBackButton={true} />
      <main className="flex flex-col items-center gap-6 px-6 py-6 pb-24">
        <div className="w-full">
          <h2 className="font-bold text-[24px] text-hana-black-900 leading-tight">
            {name}
          </h2>
          <p className="mt-1 text-[15px] text-hana-black-500">{subtitle}</p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-bold text-[28px] text-hana-black-900 tracking-tight">
              {formatKoreanCurrency(amount)}
            </span>
            <span className={`font-medium text-[15px] ${colorClass}`}>
              {changeIcon} {formatKoreanCurrency(Math.abs(priceChange))} (
              {Math.abs(changePercent)}%)
            </span>
          </div>
        </div>

        <AssetChart
          title={chart.title}
          subtitle={chart.subtitle}
          data={chart.data}
          config={chart.config}
        />

        {sections.map((section) => (
          <InfoListCard
            key={section.title}
            title={section.title}
            items={section.items}
          />
        ))}

        {footer}
      </main>
    </div>
  );
}
