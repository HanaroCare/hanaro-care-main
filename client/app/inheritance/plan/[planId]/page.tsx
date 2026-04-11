'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface Heir {
  id: number;
  name: string;
  percentage: number;
  icon: string;
}

export default function InheritancePlanDetailPage() {
  const router = useRouter();
  const [heirs, setHeirs] = useState<Heir[]>([
    { id: 1, name: '배우자', percentage: 40, icon: '👵' },
    { id: 2, name: '자녀1', percentage: 20, icon: '👨' },
    { id: 3, name: '자녀2', percentage: 20, icon: '👩' },
    { id: 4, name: '자녀3', percentage: 20, icon: '🧑' },
  ]);

  const [editingHeir, setEditingHeir] = useState<Heir | null>(null);
  const [tempPercentage, setTempPercentage] = useState<number>(0);

  // ✅ 모달 상태에 따라 스크롤을 제어합니다.
  useEffect(() => {
    if (editingHeir) {
      document.body.style.overflow = 'hidden'; // 모달 열리면 잠금
    } else {
      document.body.style.overflow = 'unset'; // 닫히면 해제
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [editingHeir]);

  const totalPercentage = useMemo(() => 
    heirs.reduce((sum, h) => sum + h.percentage, 0), [heirs]);

  const totalAsset = 13.4;

  const handleCardClick = (heir: Heir) => {
    setEditingHeir(heir);
    setTempPercentage(heir.percentage);
  };

  // 현재 편집 중인 상속인을 제외한 나머지 비율의 합
  const otherTotal = totalPercentage - (editingHeir?.percentage || 0);
  const maxVal = 100 - otherTotal;

  const confirmChange = () => {
    if (editingHeir) {
      setHeirs(prev => prev.map(h => 
        h.id === editingHeir.id ? { ...h, percentage: tempPercentage } : h
      ));
      setEditingHeir(null);
    }
  };

  const handleComplete = () => {
    if (totalPercentage === 100) {
      localStorage.setItem('inheritance_completed', 'true');
      router.push('/inheritance/result');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.scrollArea}>
        <header className={styles.header}>
          <Link href="/inheritance/plan" className={styles.headerBtn}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <span className={styles.headerTitle}>상속 설계</span>
          <Link href="/inheritance" className={styles.headerBtn}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </header>

        <div className={styles.container}>
          <h1 className={styles.pageTitle}>상속 비율을{"\n"}자유롭게 조정해보세요</h1>
          
          <div className={styles.chartImageContainer}>
            <Image src="/images/inheritance/inheritance-edit-chart.svg" alt="상속 비율 차트" width={327} height={200} priority />
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryRow}>
              <span>전체 상속 자산</span>
              <span className="font-bold">{totalAsset}억원</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.ratioHighlight}`}>
              <span>설정된 비율 합계</span>
              <span><span className={styles.ratioValue}>{totalPercentage}%</span> / 100%</span>
            </div>
          </div>

          <div className={styles.heirList}>
            {heirs.map((heir) => (
              <div key={heir.id} className={styles.heirCard} onClick={() => handleCardClick(heir)}>
                <div className={styles.heirInfo}>
                  <div className={styles.heirIcon}>{heir.icon}</div>
                  <span className={styles.heirName}>{heir.name}</span>
                </div>
                <div className={styles.heirDetails}>
                  <div className={styles.heirPercentage}>{heir.percentage}%</div>
                  <div className={styles.heirAmount}>약 {(totalAsset * (heir.percentage / 100)).toFixed(2)}억원</div>
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
          {totalPercentage === 100 ? '설정 완료' : '비율의 합을 100%로 맞춰주세요'}
        </button>
      </footer>

      {editingHeir && (
        <div className={styles.overlay} onClick={() => setEditingHeir(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>
              <span className="text-[var(--color-hana-ez-600)]">{editingHeir.name}</span>님에게{"\n"}얼마를 상속할까요?
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
                    background: `linear-gradient(to right, var(--color-hana-ez-600) 0%, var(--color-hana-ez-600) ${maxVal > 0 ? (tempPercentage / maxVal) * 100 : 0}%, #E5E7EB ${maxVal > 0 ? (tempPercentage / maxVal) * 100 : 0}%, #E5E7EB 100%)`
                }}
              />
            </div>
            
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setEditingHeir(null)}>취소</button>
              <button className={styles.confirmBtn} onClick={confirmChange}>적용하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
