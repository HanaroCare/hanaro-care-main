'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import DualActionFooter from '@/components/modules/DualActionFooter';
import Header from '@/components/navigation/Header';
import styles from './page.module.css';
import { getInheritanceContext, submitInheritancePlan, type InheritanceContext } from '../../actions/plan';

interface Heir {
  id: number;
  name: string;
  percentage: number;
  icon: string;
  relation: 'SPOUSE' | 'CHILD' | 'PARENT' | 'FAMILY';
}

const COLORS = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-hana-green-300)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
];

const RELATION_ICONS: Record<string, string> = {
  SPOUSE: '👵',
  CHILD: '👨',
  PARENT: '🧓',
  FAMILY: '🧑',
};

export default function InheritancePlanDetailPage() {
  const router = useRouter();
  const [context, setContext] = useState<InheritanceContext | null>(null);
  const [heirs, setHeirs] = useState<Heir[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingHeir, setEditingHeir] = useState<Heir | null>(null);
  const [tempPercentage, setTempPercentage] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getInheritanceContext(); // 인자 제거
        setContext(data);
        
        // 가족 구성원을 Heir 형식으로 매핑
        const initialHeirs: Heir[] = data.familyMembers.map((member, index) => ({
          id: member.userId,
          name: member.userNm,
          relation: member.relationCd,
          icon: RELATION_ICONS[member.relationCd] || '👤',
          // 초기 비율은 N분의 1로 설정 (합계 100을 위해 마지막 요소 처리)
          percentage: index === data.familyMembers.length - 1 
            ? 100 - (Math.floor(100 / data.familyMembers.length) * (data.familyMembers.length - 1))
            : Math.floor(100 / data.familyMembers.length)
        }));
        
        setHeirs(initialHeirs);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const chartData = useMemo(
    () => heirs.map((h) => ({ name: h.name, value: h.percentage })),
    [heirs],
  );

  useEffect(() => {
    if (editingHeir) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [editingHeir]);

  const totalPercentage = useMemo(
    () => heirs.reduce((sum, h) => sum + h.percentage, 0),
    [heirs],
  );

  const totalAsset = useMemo(() => {
    if (!context) return 0;
    return context.assetSummary.totalAsset / 100000000;
  }, [context]);

  const handleCardClick = (heir: Heir) => {
    setEditingHeir(heir);
    setTempPercentage(heir.percentage);
  };

  const otherTotal = totalPercentage - (editingHeir?.percentage || 0);
  const maxVal = 100 - otherTotal;

  const confirmChange = () => {
    if (editingHeir) {
      setHeirs((prev) =>
        prev.map((h) =>
          h.id === editingHeir.id ? { ...h, percentage: tempPercentage } : h,
        ),
      );
      setEditingHeir(null);
    }
  };

  const handleComplete = async () => {
    if (totalPercentage === 100) {
      try {
        await submitInheritancePlan({
          distributions: heirs.map(h => ({
            heirUserId: h.id,
            heirName: h.name,
            relation: h.relation,
            distRatio: h.percentage
          }))
        });
        localStorage.setItem('inheritance_completed', 'true');
        router.push('/inheritance/result');
      } catch (error) {
        alert('저장에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  if (loading) {
    return (
      <div className="app-shell bg-white flex items-center justify-center">
        <div className="animate-pulse text-[var(--color-hana-ez-600)]">가족 정보를 불러오는 중입니다...</div>
      </div>
    );
  }

  return (
    <div className="app-shell bg-white">
      <div className="app-layout">
        <Header title="상속 설계" showBackButton={true} />

        <div className="app-main">
          <div className={styles.container}>
            <h1 className={styles.pageTitle}>
              상속 비율을{'\n'}자유롭게 조정해보세요
            </h1>

            <div
              className={styles.chartImageContainer}
              style={{ height: '220px', position: 'relative' }}
            >
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
                    animationDuration={800}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
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
                    fontSize: '14px',
                    color: 'var(--color-hana-black-500)',
                    fontWeight: 500,
                  }}
                >
                  총 합계
                </span>
                <br />
                <span
                  style={{
                    fontSize: '20px',
                    fontWeight: 800,
                    color: 'var(--color-hana-ez-600)',
                  }}
                >
                  {totalPercentage}%
                </span>
              </div>
            </div>

            <div className={styles.summaryCard}>
              <div className={styles.summaryRow}>
                <span>전체 상속 자산</span>
                <span className="font-bold">{totalAsset.toFixed(1)}억원</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.ratioHighlight}`}>
                <span>설정된 비율 합계</span>
                <span>
                  <span className={styles.ratioValue}>{totalPercentage}%</span>{' '}
                  / 100%
                </span>
              </div>
            </div>

            <div className={styles.heirList}>
              {heirs.map((heir) => (
                <div
                  key={heir.id}
                  className={styles.heirCard}
                  onClick={() => handleCardClick(heir)}
                >
                  <div className={styles.heirInfo}>
                    <div className={styles.heirIcon}>{heir.icon}</div>
                    <span className={styles.heirName}>{heir.name}</span>
                  </div>
                  <div className={styles.heirDetails}>
                    <div className={styles.heirPercentage}>
                      {heir.percentage}%
                    </div>
                    <div className={styles.heirAmount}>
                      약 {(totalAsset * (heir.percentage / 100)).toFixed(2)}억원
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className={styles.footer}>
          <button
            className={styles.nextBtn}
            disabled={totalPercentage !== 100}
            onClick={handleComplete}
          >
            {totalPercentage === 100
              ? '설정 완료'
              : '비율의 합을 100%로 맞춰주세요'}
          </button>
        </footer>

        {editingHeir && (
          <div className={styles.overlay} onClick={() => setEditingHeir(null)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h2 className={styles.modalTitle}>
                <span className="text-[var(--color-hana-ez-600)]">
                  {editingHeir.name}
                </span>
                님에게{'\n'}얼마를 상속할까요?
              </h2>

              <div className={styles.modalSliderContainer}>
                <div className={styles.sliderHeader}>
                  <span>설정 가능 범위: 0% ~ {maxVal}%</span>
                  <span className={styles.sliderValue}>{tempPercentage}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxVal}
                  value={tempPercentage}
                  onChange={(e) => setTempPercentage(parseInt(e.target.value))}
                  className={styles.slider}
                  style={{
                    background: `linear-gradient(to right, var(--color-hana-ez-600) 0%, var(--color-hana-ez-600) ${maxVal > 0 ? (tempPercentage / maxVal) * 100 : 0}%, #E5E7EB ${maxVal > 0 ? (tempPercentage / maxVal) * 100 : 0}%, #E5E7EB 100%)`,
                  }}
                />
              </div>

              <DualActionFooter
                leftLabel="취소"
                rightLabel="적용하기"
                onLeftClick={() => setEditingHeir(null)}
                onRightClick={confirmChange}
                className="!px-0 !pt-4 !pb-0"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
