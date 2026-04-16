'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Plus, User, TriangleAlert } from 'lucide-react';
import Image from 'next/image';
import BottomSheet from '@/components/modules/BottomSheet';
import DualActionFooter from '@/components/modules/DualActionFooter';
import Header from '@/components/navigation/Header';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import styles from './page.module.css';

interface Heir {
  id: number;
  name: string;
  relationship: string;
  percentage: number;
  icon: React.ReactNode;
}

const RELATIONSHIPS = ['배우자', '자녀', '기타'];

export default function InheritancePlanDetailPage() {
  const router = useRouter();
  const [heirs, setHeirs] = useState<Heir[]>([
    {
      id: 1,
      name: '배우자',
      relationship: '배우자',
      percentage: 40,
      icon: <User className="h-5 w-5 text-[var(--color-hana-ez-600)]" />,
    },
    {
      id: 2,
      name: '자녀1',
      relationship: '자녀',
      percentage: 20,
      icon: <User className="h-5 w-5 text-[var(--color-hana-ez-600)]" />,
    },
    {
      id: 3,
      name: '자녀2',
      relationship: '자녀',
      percentage: 20,
      icon: <User className="h-5 w-5 text-[var(--color-hana-ez-600)]" />,
    },
    {
      id: 4,
      name: '자녀3',
      relationship: '자녀',
      percentage: 20,
      icon: <User className="h-5 w-5 text-[var(--color-hana-ez-600)]" />,
    },
  ]);

  const [editingHeir, setEditingHeir] = useState<Heir | null>(null);
  const [tempPercentage, setTempPercentage] = useState<number>(0);

  // New Heir Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelationship, setNewRelationship] = useState('자녀');

  useEffect(() => {
    if (editingHeir || isAddModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [editingHeir, isAddModalOpen]);

  const totalPercentage = useMemo(
    () => heirs.reduce((sum, h) => sum + h.percentage, 0),
    [heirs],
  );

  const totalAsset = 13.4;

  // 법정상속분 및 유류분 계산 로직
  const shares = useMemo(() => {
    // 배우자 1.5, 자녀 1.0, 기타 0 (가정)
    let totalParts = 0;
    heirs.forEach((h) => {
      if (h.relationship === '배우자') totalParts += 1.5;
      else if (h.relationship === '자녀') totalParts += 1.0;
      // 기타는 법정상속분이 없다고 가정하거나 필요시 추가
    });

    return heirs.map((h) => {
      let part = 0;
      if (h.relationship === '배우자') part = 1.5;
      else if (h.relationship === '자녀') part = 1.0;

      const legalShareRatio = totalParts > 0 ? part / totalParts : 0;
      const legalPercentage = Math.round(legalShareRatio * 100);
      const forcedPercentage = Math.round((legalShareRatio / 2) * 100);

      return {
        id: h.id,
        legalPercentage,
        forcedPercentage,
      };
    });
  }, [heirs]);

  const currentEditingShares = useMemo(() => {
    if (!editingHeir) return null;
    return shares.find((s) => s.id === editingHeir.id);
  }, [shares, editingHeir]);

  const handleCardClick = (heir: Heir) => {
    setEditingHeir(heir);
    setTempPercentage(heir.percentage);
  };

  const handleOpenAddModal = () => {
    setNewName('');
    setNewRelationship('자녀');
    setIsAddModalOpen(true);
  };

  const handleAddHeir = () => {
    if (!newName.trim()) return;

    const newId = heirs.length > 0 ? Math.max(...heirs.map((h) => h.id)) + 1 : 1;
    const newHeir: Heir = {
      id: newId,
      name: newName,
      relationship: newRelationship,
      percentage: 0,
      icon: <User className="h-5 w-5 text-[var(--color-hana-ez-600)]" />,
    };
    setHeirs([...heirs, newHeir]);
    setIsAddModalOpen(false);
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

  const handleComplete = () => {
    if (totalPercentage === 100) {
      localStorage.setItem('inheritance_completed', 'true');
      const heirsToSave = heirs.map((h) => {
        const shareInfo = shares.find((s) => s.id === h.id);
        return {
          id: h.id,
          name: h.name,
          relationship: h.relationship,
          percentage: h.percentage,
          legalPercentage: shareInfo?.legalPercentage || 0,
          forcedPercentage: shareInfo?.forcedPercentage || 0,
        };
      });
      localStorage.setItem('inheritance_heirs', JSON.stringify(heirsToSave));
      router.push('/inheritance/result');
    }
  };

  return (
    <div className="app-shell bg-white">
      <div className="app-layout">
        <Header title="상속 설계" showBackButton={true} />

        <div className="app-main">
          <div className={styles.container}>
            <h1 className={styles.pageTitle}>
              상속 비율을{'\n'}자유롭게 조정해보세요
            </h1>

            <div className={styles.chartImageContainer}>
              <Image
                src="/images/inheritance/intro-slide-3.png"
                alt="Inheritance chart"
                width={220}
                height={220}
                className="mx-auto"
              />
            </div>

            <div className={styles.summaryCard}>
              <div className={styles.summaryRow}>
                <span>전체 상속 자산</span>
                <span className="font-bold">{totalAsset}억원</span>
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
                    <div className="flex flex-col">
                      <span className={styles.heirName}>{heir.name}</span>
                      <span className="text-[11px] text-gray-400">{heir.relationship}</span>
                    </div>
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

              <button className={styles.addHeirBtn} onClick={handleOpenAddModal}>
                <Plus size={18} />
                <span>상속인 추가하기</span>
              </button>
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

              <div className={styles.modalInputContainer}>
                <div className={styles.inputHeader}>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-[12px] font-bold text-red-500">
                        최소 유류분 보장: {currentEditingShares?.forcedPercentage}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.percentageInputWrapper}>
                  <input
                    type="number"
                    min="0"
                    max={maxVal}
                    value={tempPercentage === 0 ? '' : tempPercentage}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                      if (val > maxVal) {
                        setTempPercentage(maxVal);
                      } else {
                        setTempPercentage(val);
                      }
                    }}
                    className={styles.percentageInput}
                    placeholder="0"
                  />
                  <span className={styles.percentSymbol}>%</span>
                </div>

                <p className="text-[12px] text-gray-400 mt-2">
                  설정 가능 범위: 0% ~ {maxVal}%
                </p>

                {tempPercentage < (currentEditingShares?.forcedPercentage || 0) && (
                  <p className="flex items-center gap-1 text-[11px] text-red-500 mt-2">
                    <TriangleAlert size={12} />
                    유류분({currentEditingShares?.forcedPercentage}%)보다 적게 설정되었습니다.
                  </p>
                )}
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

        <BottomSheet isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
          <div className={styles.bottomSheetContent}>
            <h2 className={styles.bottomSheetTitle}>상속인 추가</h2>
            
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>이름</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="상속인의 이름을 입력해주세요"
                className={styles.textInput}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>가족 관계</label>
              <div className={styles.relationshipGrid}>
                {RELATIONSHIPS.map((rel) => (
                  <button
                    key={rel}
                    className={`${styles.relBtn} ${newRelationship === rel ? styles.activeRel : ''}`}
                    onClick={() => setNewRelationship(rel)}
                  >
                    {rel}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <PrimaryButton
                label="추가하기"
                disabled={!newName.trim()}
                onClick={handleAddHeir}
              />
            </div>
          </div>
        </BottomSheet>
      </div>
    </div>
  );
}

