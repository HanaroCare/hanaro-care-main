'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { User } from 'lucide-react';
// import BottomNav from '@/components/BottomNav';
import InheritanceHeader from '@/components/InheritanceHeader';
import styles from './page.module.css';

const COLORS = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-hana-green-300)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
];

export default function InheritanceResultPage() {
  const router = useRouter();

  const resultData = useMemo(() => [
    { name: '배우자', value: 30 },
    { name: '자녀1', value: 30 },
    { name: '자녀2', value: 20 },
    { name: '자녀3', value: 20 },
  ], []);

  useEffect(() => {
    localStorage.setItem('inheritance_completed', 'true');
  }, []);

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('상속 설계를 처음부터 다시 시작하시겠습니까?')) {
      localStorage.removeItem('inheritance_completed');
      router.push('/inheritance/plan');
    }
  };

  return (
    <div className="app-shell bg-white">
      <div className="app-layout">
        <InheritanceHeader activeTab="inheritance" />

        <div className={styles.scrollArea}>
          <main className={styles.content}>
            <h1 className={styles.title}>상속설계 결과</h1>
            
            <section className={styles.chartSection}>
              <div className={styles.chartWrapper} style={{ height: '220px', width: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={resultData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                      animationDuration={1000}
                    >
                      {resultData.map((entry, index) => (
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
                  <span style={{ fontSize: '13px', color: 'var(--color-hana-black-500)', fontWeight: 500 }}>상속비율</span><br/>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-hana-ez-600)' }}>100%</span>
                </div>
              </div>

              <div className={styles.legendGrid}>
                <div className={styles.legendItem}>
                  <span className={styles.legendColor} style={{ backgroundColor: 'var(--color-chart-1)' }} />
                  <span>배우자 ( 30% )</span>
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.legendColor} style={{ backgroundColor: 'var(--color-chart-2)' }} />
                  <span>자녀1 ( 30% )</span>
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.legendColor} style={{ backgroundColor: 'var(--color-hana-green-300)' }} />
                  <span>자녀2 ( 20% )</span>
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.legendColor} style={{ backgroundColor: 'var(--color-chart-3)' }} />
                  <span>자녀3 ( 20% )</span>
                </div>
              </div>
            </section>

            <div className={styles.memberList}>
              <div className={styles.memberCard}>
                <div className={styles.memberHeader}>
                  <div className={styles.memberInfo}>
                    <div className={styles.avatar}>
                      <User className="w-5 h-5 text-[var(--color-hana-ez-600)]" />
                    </div>
                    <span className={styles.memberName}>배우자</span>
                  </div>
                  <div className={`${styles.statusBadge} ${styles.statusPositive}`}>
                    유류분보다 +7,000만원
                  </div>
                </div>
                <div className={styles.memberDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>내가 정한 금액</span>
                    <span className={styles.highlightValue}>3.35억원</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>법정상속분</span>
                    <span className={styles.detailValue}>6.0억원</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>유류분</span>
                    <span className={styles.detailValue}>3.0억원</span>
                  </div>
                </div>
                <Link href="#" className={styles.letterLink}>상속편지 남기기 &gt;</Link>
              </div>

              <div className={styles.memberCard}>
                <div className={styles.memberHeader}>
                  <div className={styles.memberInfo}>
                    <div className={styles.avatar}>
                      <User className="w-5 h-5 text-[var(--color-hana-ez-600)]" />
                    </div>
                    <span className={styles.memberName}>자녀1</span>
                  </div>
                  <div className={`${styles.statusBadge} ${styles.statusPositive}`}>
                    유류분보다 +7,000만원
                  </div>
                </div>
                <div className={styles.memberDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>내가 정한 금액</span>
                    <span className={styles.highlightValue}>3.35억원</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>법정상속분</span>
                    <span className={styles.detailValue}>6.0억원</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>유류분</span>
                    <span className={styles.detailValue}>3.0억원</span>
                  </div>
                </div>
                <Link href="#" className={styles.letterLink}>상속편지 남기기 &gt;</Link>
              </div>

              <div className={styles.memberCard}>
                <div className={styles.memberHeader}>
                  <div className={styles.memberInfo}>
                    <div className={styles.avatar}>
                      <User className="w-5 h-5 text-[var(--color-hana-ez-600)]" />
                    </div>
                    <span className={styles.memberName}>자녀2</span>
                  </div>
                  <div className={`${styles.statusBadge} ${styles.statusNegative}`}>
                    유류분보다 -500만원
                  </div>
                </div>
                <div className={styles.memberDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>내가 정한 금액</span>
                    <span className={styles.highlightValue}>3.35억원</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>법정상속분</span>
                    <span className={styles.detailValue}>6.0억원</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>유류분</span>
                    <span className={styles.detailValue}>3.0억원</span>
                  </div>
                </div>
                <Link href="#" className={styles.letterLink}>상속편지 남기기 &gt;</Link>
              </div>
            </div>

            <Link href="/inheritance/plan" className={styles.actionButton} onClick={handleReset}>
              상속 설계 다시하기
            </Link>
          </main>
        </div>

        <div className={styles.navWrapper}>
          {/* <BottomNav activePath="/inheritance" /> */}
        </div>
      </div>
    </div>
  );
}
