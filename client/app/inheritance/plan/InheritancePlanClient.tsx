'use client';

import { useMemo, useEffect, useState } from 'react';
import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Header from '@/components/navigation/Header';
import { getInheritanceContext, type InheritanceContext } from '../actions/plan';
import styles from './page.module.css';

const COLORS = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-hana-green-300)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
];
type Props = {
  initialData: InheritanceContext;
};

export default function InheritancePlanClient({ initialData }: Props) {
const chartData = useMemo(() => {
    const { assetSummary } = initialData;
    return [
      { name: '예·적금', value: assetSummary.savingsAndDeposits, color: 'var(--color-chart-1)' },
      { name: '주식·펀드', value: assetSummary.stocksAndFunds, color: 'var(--color-chart-2)' },
      { name: '연금', value: assetSummary.pensions, color: 'var(--color-hana-green-300)' },
      { name: '기타자산', value: assetSummary.otherAssets, color: 'var(--color-chart-3)' },
    ].filter(item => item.value > 0);
  }, [initialData]);

  const totalAssetBillion = (initialData.assetSummary.totalAsset / 100000000).toFixed(1);

  return (
    <div className="app-shell bg-white">
      <div className="app-layout">
        <Header title="상속 설계" showBackButton={true} />

        <div className="app-main">
          <div className={styles.content}>
            <p className={styles.customerName}>손님의 상속설계를 도와드릴게요</p>
            <h1 className={styles.pageTitle}>상속할 자산을 확인해주세요</h1>

            <section className={styles.chartSection}>
              <div className={styles.chartWrapper} style={{ height: '200px', width: '100%', position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      animationDuration={1000}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-hana-black-500)' }}>총 자산</span><br/>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-hana-ez-600)' }}>{totalAssetBillion}억</span>
                </div>
              </div>
            </section>

            <div className={styles.card}>
              <p className={styles.cardLabel}>연동 총 자산</p>
              <p className={styles.cardTitle}>{totalAssetBillion}억원</p>

              <div className={styles.divider} />

              <ul className={styles.list}>
                {chartData.map((item, idx) => (
                  <li key={idx} className={styles.listItem}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className={styles.itemName}>{item.name}</span>
                    </div>
                    <span className={styles.itemValue}>{(item.value / 10000).toLocaleString()}만원</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.card}>
              <p className={styles.cardLabel}>부동산</p>
              <div className={styles.listItem}>
                <span className={styles.itemName}>보유 부동산 합계</span>
                <span className={styles.highlightValue}>{(initialData.assetSummary.realEstate / 100000000).toFixed(1)}억원</span>
              </div>
            </div>
          </div>
        </div>

        <footer className={styles.footer}>
          <Link href="/inheritance/plan/1" className={styles.nextBtn}>
            다음으로
          </Link>
        </footer>
      </div>
    </div>
  );
}