'use client';

import {
  Edit2,
  Loader2,
  Plus,
  Trash2,
  TriangleAlert,
  User,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  type HeirDistribution,
  type InheritanceContext,
  submitInheritancePlan,
} from '@/app/inheritance/actions/plan';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import BottomSheet from '@/components/modules/BottomSheet';
import DualActionFooter from '@/components/modules/DualActionFooter';
import Header from '@/components/navigation/Header';
import styles from './page.module.css';

interface Heir {
  id: number;
  userId?: string;
  name: string;
  relationship: 'SPOUSE' | 'CHILD' | 'PARENT' | 'FAMILY';
  percentage: number;
  icon: React.ReactNode;
}

type Props = {
  initialData: InheritanceContext;
};

const RELATIONSHIPS = [
  { label: '배우자', value: 'SPOUSE' },
  { label: '자녀', value: 'CHILD' },
  { label: '부모', value: 'PARENT' },
  { label: '기타', value: 'FAMILY' },
];

export default function InheritancePlanDetailClient({ initialData }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [editingHeir, setEditingHeir] = useState<Heir | null>(null);
  const [tempPercentage, setTempPercentage] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [targetHeirId, setTargetHeirId] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [newRelationship, setNewRelationship] = useState<'SPOUSE' | 'CHILD' | 'PARENT' | 'FAMILY'>('CHILD');

  const [totalAsset] = useState(initialData.assetSummary.totalAsset / 100000000);
  const [heirs, setHeirs] = useState<Heir[]>(
    initialData.familyMembers.map((member, index) => ({
      id: index + 1,
      userId: member.userId,
      name: member.name,
      relationship: member.relation,
      percentage: 0,
      icon: <User className="h-5 w-5 text-[var(--color-hana-ez-600)]" />,
    })),
  );

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

  const shares = useMemo(() => {
    let totalParts = 0;
    heirs.forEach((h) => {
      if (h.relationship === 'SPOUSE') totalParts += 1.5;
      else totalParts += 1.0;
    });

    return heirs.map((h) => {
      let part = h.relationship === 'SPOUSE' ? 1.5 : 1.0;
      const legalShareRatio = totalParts > 0 ? part / totalParts : 0;
      return {
        id: h.id,
        legalPercentage: Math.round(legalShareRatio * 100),
        forcedPercentage: Math.round((legalShareRatio / 2) * 100),
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
    setModalMode('add');
    setNewName('');
    setNewRelationship('CHILD');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (e: React.MouseEvent, heir: Heir) => {
    e.stopPropagation();
    setModalMode('edit');
    setTargetHeirId(heir.id);
    setNewName(heir.name);
    setNewRelationship(heir.relationship);
    setIsAddModalOpen(true);
  };

  const handleDeleteHeir = (e: React.MouseEvent, heirId: number) => {
    e.stopPropagation();
    setHeirs((prev) => prev.filter((h) => h.id !== heirId));
  };

  const handleSaveModal = () => {
    if (!newName.trim()) return;
    if (modalMode === 'add') {
      const newId = heirs.length > 0 ? Math.max(...heirs.map((h) => h.id)) + 1 : 1;
      const newHeir: Heir = {
        id: newId,
        name: newName,
        relationship: newRelationship,
        percentage: 0,
        icon: <User className="h-5 w-5 text-[var(--color-hana-ez-600)]" />,
      };
      setHeirs((prev) => [...prev, newHeir]);
    } else if (modalMode === 'edit' && targetHeirId !== null) {
      setHeirs((prev) =>
        prev.map((h) => (h.id === targetHeirId ? { ...h, name: newName.trim(), relationship: newRelationship } : h))
      );
    }
    setIsAddModalOpen(false);
  };

  const otherTotal = totalPercentage - (editingHeir?.percentage || 0);
  const maxVal = 100 - otherTotal;

  const confirmChange = () => {
    if (editingHeir) {
      setHeirs((prev) =>
        prev.map((h) => (h.id === editingHeir.id ? { ...h, percentage: tempPercentage } : h))
      );
      setEditingHeir(null);
    }
  };

  const handleComplete = async () => {
    if (totalPercentage === 100) {
      setSubmitting(true);
      try {
        const distributions: HeirDistribution[] = heirs.map((h) => ({
          heirUserId: h.userId || null,
          heirName: h.name,
          relation: h.relationship,
          distRatio: h.percentage, // 백분율 그대로 전송 (합계 100)
        }));

        console.log('[handleComplete] Submitting distributions:', distributions);
        await submitInheritancePlan({ distributions });
        router.push('/inheritance/result');
      } catch (error) {
        console.error('Failed to submit inheritance plan:', error);
        alert('상속 설계 저장에 실패했습니다. 다시 시도해주세요.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="app-shell bg-white">
      <div className="app-layout">
        <Header title="상속 설계" showBackButton={true} />
        <div className="app-main">
          <div className={styles.container}>
            <h1 className={styles.pageTitle}>상속 비율을{"\n"}자유롭게 조정해보세요</h1>
            <div className={styles.chartImageContainer}>
              <Image src="/images/inheritance/intro-slide-3.png" alt="Chart" width={220} height={220} className="mx-auto" />
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryRow}>
                <span>전체 상속 자산</span>
                <span className="font-bold">{totalAsset.toLocaleString()}억원</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.ratioHighlight}`}>
                <span>설정된 비율 합계</span>
                <span><span className={styles.ratioValue}>{totalPercentage}%</span> / 100%</span>
              </div>
            </div>
            <div className={styles.heirList}>
              {heirs.map((heir) => (
                <div key={heir.id} className={styles.heirCard}>
                  <div className={styles.heirContent} onClick={() => handleCardClick(heir)} role="button" tabIndex={0}>
                    <div className={styles.heirInfo}>
                      <div className={styles.heirIcon}>{heir.icon}</div>
                      <div className="flex flex-col">
                        <span className={styles.heirName}>{heir.name}</span>
                        <span className="text-[11px] text-gray-400">
                          {RELATIONSHIPS.find((r) => r.value === heir.relationship)?.label || '기타'}
                        </span>
                      </div>
                    </div>
                    <div className={styles.heirDetails}>
                      <div className={styles.heirPercentage}>{heir.percentage}%</div>
                      <div className={styles.heirAmount}>약 {(totalAsset * (heir.percentage / 100)).toFixed(2)}억원</div>
                    </div>
                  </div>
                  <div className={styles.heirActions}>
                    <button type="button" className={`${styles.actionBtn} ${styles.editBtn}`} onClick={(e) => handleOpenEditModal(e, heir)} aria-label="수정"><Edit2 size={14} /></button>
                    <div className={styles.separator} />
                    <button type="button" className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={(e) => handleDeleteHeir(e, heir.id)} aria-label="삭제"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
              <button type="button" className={styles.addHeirBtn} onClick={handleOpenAddModal}><Plus size={18} /><span>상속인 추가하기</span></button>
            </div>
          </div>
        </div>
        <footer className={styles.footer}>
          <button type="button" className={styles.nextBtn} disabled={totalPercentage !== 100 || submitting} onClick={handleComplete}>
            {submitting ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : totalPercentage === 100 ? '설정 완료' : '비율의 합을 100%로 맞춰주세요'}
          </button>
        </footer>

        {editingHeir && (
          <div className={styles.overlay} onClick={() => setEditingHeir(null)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h2 className={styles.modalTitle}><span className="text-[var(--color-hana-ez-600)]">{editingHeir.name}</span>님에게{"\n"}얼마를 상속할까요?</h2>
              <div className={styles.modalInputContainer}>
                <div className={styles.inputHeader}>
                  <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-red-500" /><span className="font-bold text-[12px] text-red-500">최소 유류분 보장: {currentEditingShares?.forcedPercentage}%</span></div>
                </div>
                <div className={styles.percentageInputWrapper}>
                  <input type="number" min="0" max={maxVal} value={tempPercentage === 0 ? '' : tempPercentage} onChange={(e) => setTempPercentage(Math.min(maxVal, parseInt(e.target.value) || 0))} className={styles.percentageInput} placeholder="0" />
                  <span className={styles.percentSymbol}>%</span>
                </div>
                <p className="mt-2 text-[12px] text-gray-400">설정 가능 범위: 0% ~ {maxVal}%</p>
              </div>
              <DualActionFooter leftLabel="취소" rightLabel="적용하기" onLeftClick={() => setEditingHeir(null)} onRightClick={confirmChange} className="!px-0 !pt-4 !pb-0" />
            </div>
          </div>
        )}
        <BottomSheet isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
          <div className={styles.bottomSheetContent}>
            <h2 className={styles.bottomSheetTitle}>{modalMode === 'add' ? '상속인 추가' : '상속인 수정'}</h2>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>이름</label>
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="상속인의 이름을 입력해주세요" className={styles.textInput} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>가족 관계</label>
              <div className={styles.relationshipGrid}>
                {RELATIONSHIPS.map((rel) => (
                  <button key={rel.value} className={`${styles.relBtn} ${newRelationship === rel.value ? styles.activeRel : ""}`} onClick={() => setNewRelationship(rel.value as any)}>{rel.label}</button>
                ))}
              </div>
            </div>
            <div className="mt-8"><PrimaryButton label={modalMode === 'add' ? '추가하기' : '수정하기'} disabled={!newName.trim()} onClick={handleSaveModal} /></div>
          </div>
        </BottomSheet>
      </div>
    </div>
  );
}
