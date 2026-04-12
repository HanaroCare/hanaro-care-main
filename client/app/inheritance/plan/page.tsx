'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import SubHeader from '@/components/SubHeader';
import styles from './page.module.css';

const COLORS = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-hana-green-300)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
];

const ASSET_DATA = [
  { name: '예·적금', value: 2800, color: 'var(--color-chart-1)' },
  { name: '주식·펀드', value: 7200, color: 'var(--color-chart-2)' },
  { name: '연금', value: 2300, color: 'var(--color-hana-green-300)' },
  { name: '보통예금', value: 1680, color: 'var(--color-chart-3)' },
];

export default function InheritancePlanPage() {
  const chartData = useMemo(() => ASSET_DATA, []);

  return (
    <div className="app-shell bg-white">
      <div className="app-layout">
        <SubHeader title="상속 설계" backUrl="/inheritance/intro" />

        <div className={styles.scrollArea}>
          <main className={styles.content}>
            <p className={styles.customerName}>권하나 손님의 상속설계를 도와드릴게요</p>
            <h1 className={styles.pageTitle}>상속할 자산을 확인해주세요</h1>

            {/* Recharts Pie Chart Section */}
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
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
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
                  <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-hana-ez-600)' }}>13.4억</span>
                </div>
              </div>
            </section>

            {/* Financial assets card */}
            <div className={styles.card}>
              <p className={styles.cardLabel}>연동 총 자산</p>
              <p className={styles.cardTitle}>13.4억원</p>

              <div className={styles.divider} />

              <ul className={styles.list}>
                {ASSET_DATA.map((item, idx) => (
                  <li key={idx} className={styles.listItem}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className={styles.itemName}>{item.name}</span>
                    </div>
                    <span className={styles.itemValue}>{item.value.toLocaleString()}만원</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Real estate card */}
            <div className={styles.card}>
              <p className={styles.cardLabel}>부동산</p>
              <div className={styles.listItem}>
                <span className={styles.itemName}>아파트 (서울 강남구)</span>
                <span className={styles.highlightValue}>12.0억원</span>
              </div>
            </div>
          </main>
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
