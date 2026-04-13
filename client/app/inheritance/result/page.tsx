'use client';

import { AlertCircle, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { NavigationBar } from '@/components/navigation/NavigationBar';
import { TabNavigation } from '@/components/navigation/TabNavigation';
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeTab, setActiveTab] = useState('inheritance');

  const handleTabChange = (tabId: string) => {
    if (tabId === 'asset') {
      router.push('/asset/simulator');
    } else if (tabId === 'inheritance') {
      const isInheritanceCompleted =
        localStorage.getItem('inheritance_completed') === 'true';
      router.push(
        isInheritanceCompleted ? '/inheritance/result' : '/inheritance/intro',
      );
    }
  };

  const resultData = useMemo(
    () => [
      { name: '배우자', value: 30 },
      { name: '자녀1', value: 30 },
      { name: '자녀2', value: 20 },
      { name: '자녀3', value: 20 },
    ],
    [],
  );

  useEffect(() => {
    localStorage.setItem('inheritance_completed', 'true');
  }, []);

  const openResetModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const confirmReset = () => {
    localStorage.removeItem('inheritance_completed');
    router.push('/inheritance');
  };

  return (
    <div className="app-shell bg-white">
      <div className="app-layout">
        <TabNavigation
          tabs={[
            { id: 'asset', label: '자산' },
            { id: 'inheritance', label: '상속' },
          ]}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        <div className={styles.scrollArea}>
          <main className={styles.content}>
            <h1 className={styles.title}>상속설계 결과</h1>

            <section className={styles.chartSection}>
              <div
                className={styles.chartWrapper}
                style={{ height: '220px', width: '220px' }}
              >
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
                      {resultData.map((entry) => (
                        <Cell
                          key={`cell-${entry.name}`}
                          fill={
                            COLORS[resultData.indexOf(entry) % COLORS.length]
                          }
                          stroke="none"
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '13px',
                      color: 'var(--color-hana-black-500)',
                      fontWeight: 500,
                    }}
                  >
                    상속비율
                  </span>
                  <br />
                  <span
                    style={{
                      fontSize: '18px',
                      fontWeight: 800,
                      color: 'var(--color-hana-ez-600)',
                    }}
                  >
                    100%
                  </span>
                </div>
              </div>

              <div className={styles.legendGrid}>
                <div className={styles.legendItem}>
                  <span
                    className={styles.legendColor}
                    style={{ backgroundColor: 'var(--color-chart-1)' }}
                  />
                  <span>배우자 ( 30% )</span>
                </div>
                <div className={styles.legendItem}>
                  <span
                    className={styles.legendColor}
                    style={{ backgroundColor: 'var(--color-chart-2)' }}
                  />
                  <span>자녀1 ( 30% )</span>
                </div>
                <div className={styles.legendItem}>
                  <span
                    className={styles.legendColor}
                    style={{ backgroundColor: 'var(--color-hana-green-300)' }}
                  />
                  <span>자녀2 ( 20% )</span>
                </div>
                <div className={styles.legendItem}>
                  <span
                    className={styles.legendColor}
                    style={{ backgroundColor: 'var(--color-chart-3)' }}
                  />
                  <span>자녀3 ( 20% )</span>
                </div>
              </div>
            </section>

            <div className={styles.memberList}>
              <div className={styles.memberCard}>
                <div className={styles.memberHeader}>
                  <div className={styles.memberInfo}>
                    <div className={styles.avatar}>
                      <User className="h-5 w-5 text-[var(--color-hana-ez-600)]" />
                    </div>
                    <span className={styles.memberName}>배우자</span>
                  </div>
                  <div
                    className={`${styles.statusBadge} ${styles.statusPositive}`}
                  >
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
                <Link href="#" className={styles.letterLink}>
                  상속편지 남기기 &gt;
                </Link>
              </div>

              <div className={styles.memberCard}>
                <div className={styles.memberHeader}>
                  <div className={styles.memberInfo}>
                    <div className={styles.avatar}>
                      <User className="h-5 w-5 text-[var(--color-hana-ez-600)]" />
                    </div>
                    <span className={styles.memberName}>자녀1</span>
                  </div>
                  <div
                    className={`${styles.statusBadge} ${styles.statusPositive}`}
                  >
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
                <Link href="#" className={styles.letterLink}>
                  상속편지 남기기 &gt;
                </Link>
              </div>

              <div className={styles.memberCard}>
                <div className={styles.memberHeader}>
                  <div className={styles.memberInfo}>
                    <div className={styles.avatar}>
                      <User className="h-5 w-5 text-[var(--color-hana-ez-600)]" />
                    </div>
                    <span className={styles.memberName}>자녀2</span>
                  </div>
                  <div
                    className={`${styles.statusBadge} ${styles.statusNegative}`}
                  >
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
                <Link href="#" className={styles.letterLink}>
                  상속편지 남기기 &gt;
                </Link>
              </div>
            </div>

            <button className={styles.actionButton} onClick={openResetModal}>
              상속 설계 다시하기
            </button>
            <div className="h-20 w-full" aria-hidden="true" />
          </main>
        </div>

        {showConfirmModal && (
          <div className="fade-in fixed inset-0 z-[100] flex animate-in items-center justify-center bg-black/50 p-6 duration-200">
            <div className="zoom-in-95 w-full max-w-[320px] animate-in overflow-hidden rounded-2xl bg-white shadow-2xl duration-200">
              <div className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-hana-red-50)]">
                  <AlertCircle className="h-6 w-6 text-[var(--color-hana-red-500)]" />
                </div>
                <h3 className="mb-2 font-bold text-gray-900 text-lg">
                  상속 설계 초기화
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  작성하신 상속 설계를 처음부터
                  <br />
                  다시 시작하시겠습니까?
                </p>
              </div>
              <div className="flex border-gray-100 border-t">
                <button
                  className="flex-1 px-4 py-4 font-medium text-gray-500 text-sm transition-colors hover:bg-gray-50"
                  onClick={() => setShowConfirmModal(false)}
                >
                  취소
                </button>
                <button
                  className="flex-1 border-gray-100 border-l px-4 py-4 font-bold text-[var(--color-hana-red-500)] text-sm transition-colors hover:bg-red-50"
                  onClick={confirmReset}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}

        <NavigationBar />
      </div>
    </div>
  );
}
