'use client';

import { AlertCircle, User, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { NavigationBar } from '@/components/navigation/NavigationBar';
import { TabNavigation } from '@/components/navigation/TabNavigation';
import { getPlanSummary, InheritancePlanResponse } from '@/app/inheritance/actions/plan';
import styles from './page.module.css';

const COLORS = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-hana-green-300)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
];

interface DisplayHeir {
  id: number;
  name: string;
  relation: string;
  percentage: number;
  distributedAmt: number;
  legalPercentage: number;
  forcedPercentage: number;
  hasLetter: boolean;
}

export default function InheritanceResultPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeTab, setActiveTab] = useState('inheritance');
  const [planData, setPlanData] = useState<InheritancePlanResponse | null>(null);

  const handleTabChange = (tabId: string) => {
    if (tabId === 'asset') {
      router.push('/asset/simulator');
    } else if (tabId === 'inheritance') {
      router.push('/inheritance/result');
    }
  };

  useEffect(() => {
    async function loadPlan() {
      try {
        const data = await getPlanSummary();
        setPlanData(data);
      } catch (error) {
        console.error('Failed to load plan summary:', error);
        // 계획이 없는 경우 인트로로 이동하거나 처리
        router.push('/inheritance/intro');
      } finally {
        setLoading(false);
      }
    }
    loadPlan();
  }, [router]);

  // 서버 데이터를 화면 표시용 데이터로 변환 및 법정분 계산
  const displayHeirs = useMemo(() => {
    if (!planData) return [];

    let totalParts = 0;
    planData.heirs.forEach((h) => {
      if (h.relation === 'SPOUSE') totalParts += 1.5;
      else totalParts += 1.0;
    });

    return planData.heirs.map((h) => {
      let part = 1.0;
      if (h.relation === 'SPOUSE') part = 1.5;

      const legalShareRatio = totalParts > 0 ? part / totalParts : 0;
      const legalPercentage = Math.round(legalShareRatio * 100);
      const forcedPercentage = Math.round((legalShareRatio / 2) * 100);

      return {
        id: h.inheritDetailId,
        name: h.heirName,
        relation: h.relation,
        percentage: h.distRatio,
        distributedAmt: h.distributedAmt / 100000000, // 억원 단위
        legalPercentage,
        forcedPercentage,
        hasLetter: h.hasLetter
      };
    });
  }, [planData]);

  const resultData = useMemo(
    () => displayHeirs.map(h => ({ name: h.name, value: h.percentage })),
    [displayHeirs],
  );

  const totalAsset = planData ? planData.totalInheritAmt / 100000000 : 0;

  const openResetModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const confirmReset = () => {
    // 서버 데이터는 유지하되 UI 상에서 다시 설계를 유도
    router.push('/inheritance/plan/new');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-hana-ez-600)]" />
      </div>
    );
  }

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
                      {resultData.map((entry, index) => (
                        <Cell
                          key={`cell-${entry.name}`}
                          fill={
                            COLORS[index % COLORS.length]
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
                {displayHeirs.map((heir, index) => (
                  <div key={heir.id} className={styles.legendItem}>
                    <span
                      className={styles.legendColor}
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span>{heir.name} ( {heir.percentage}% )</span>
                  </div>
                ))}
              </div>
            </section>

            <div className={styles.memberList}>
              {displayHeirs.map((heir) => {
                const myAmount = heir.distributedAmt;
                const forcedAmount = totalAsset * (heir.forcedPercentage / 100);
                const legalAmount = totalAsset * (heir.legalPercentage / 100);
                const diff = (myAmount - forcedAmount) * 10000; // 만원 단위

                return (
                  <div key={heir.id} className={styles.memberCard}>
                    <div className={styles.memberHeader}>
                      <div className={styles.memberInfo}>
                        <div className={styles.avatar}>
                          <User className="h-5 w-5 text-[var(--color-hana-ez-600)]" />
                        </div>
                        <span className={styles.memberName}>{heir.name}</span>
                      </div>
                      <div
                        className={`${styles.statusBadge} ${diff >= 0 ? styles.statusPositive : styles.statusNegative}`}
                      >
                        유류분보다 {diff >= 0 ? '+' : ''}{diff.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}만원
                      </div>
                    </div>
                    <div className={styles.memberDetails}>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>내가 정한 금액</span>
                        <span className={styles.highlightValue}>
                          {myAmount.toFixed(2)}억원
                        </span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>법정상속분</span>
                        <span className={styles.legalValue}>{legalAmount.toFixed(2)}억원</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>유류분</span>
                        <span className={styles.forcedValue}>{forcedAmount.toFixed(2)}억원</span>
                      </div>
                    </div>
                    <Link href={`/inheritance/letter/recipients/${heir.id}`} className={styles.letterLink}>
                      {heir.hasLetter ? '작성된 편지 보기 >' : '상속편지 남기기 >'}
                    </Link>
                  </div>
                );
              })}
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
