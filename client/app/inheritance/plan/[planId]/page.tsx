'use client';

import { Edit2, Loader2, Plus, Trash2, TriangleAlert, User } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  getInheritanceContext,
  type HeirDistribution,
  submitInheritancePlan,
} from '@/app/inheritance/actions/plan';

// 공통 컴포넌트 import
import FormInput from '@/components/baseelements/FormInput';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import BottomSheet from '@/components/modules/BottomSheet';
import DualActionFooter from '@/components/modules/DualActionFooter';
import Header from '@/components/navigation/Header';
import PageHeading from '@/components/typography/PageHeading';

interface Heir {
  id: number;
  userId?: number;
  name: string;
  relationship: 'SPOUSE' | 'CHILD' | 'PARENT' | 'FAMILY';
  percentage: number;
  icon: React.ReactNode;
}

const RELATIONSHIPS = [
  { label: '배우자', value: 'SPOUSE' },
  { label: '자녀', value: 'CHILD' },
  { label: '부모', value: 'PARENT' },
  { label: '기타', value: 'FAMILY' },
] as const;

export default function InheritancePlanDetailPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [totalAsset, setTotalAsset] = useState(0);
  const [heirs, setHeirs] = useState<Heir[]>([]);

  const [editingHeir, setEditingHeir] = useState<Heir | null>(null);
  const [tempPercentage, setTempPercentage] = useState<string>('0');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [targetHeirId, setTargetHeirId] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [newRelationship, setNewRelationship] = useState<Heir['relationship']>('CHILD');

  useEffect(() => {
    async function loadContext() {
      try {
        const context = await getInheritanceContext();
        setTotalAsset(context.assetSummary.totalAsset / 100000000);

        const initialHeirs: Heir[] = context.familyMembers.map((member, index) => ({
          id: index + 1,
          userId: member.userId,
          name: member.userNm,
          relationship: member.relationCd as Heir['relationship'],
          percentage: 0,
          icon: <User className="h-5 w-5 text-hana-ez-600" />,
        }));
        setHeirs(initialHeirs);
      } catch (error) {
        console.error('Failed to load inheritance context:', error);
      } finally {
        setLoading(false);
      }
    }
    loadContext();
  }, []);

  const totalPercentage = useMemo(() => heirs.reduce((sum, h) => sum + h.percentage, 0), [heirs]);

  const shares = useMemo(() => {
    let totalParts = 0;
    heirs.forEach((h) => {
      if (h.relationship === 'SPOUSE') totalParts += 1.5;
      else totalParts += 1.0;
    });

    return heirs.map((h) => {
      const part = h.relationship === 'SPOUSE' ? 1.5 : 1.0;
      const legalShareRatio = totalParts > 0 ? part / totalParts : 0;
      return {
        id: h.id,
        forcedPercentage: Math.round((legalShareRatio / 2) * 100),
      };
    });
  }, [heirs]);

  const currentEditingShares = useMemo(() =>
      shares.find((s) => s.id === editingHeir?.id), [shares, editingHeir]);

  const handleCardClick = (heir: Heir) => {
    setEditingHeir(heir);
    setTempPercentage(heir.percentage.toString());
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
    setNewName(heir.name ?? '');
    setNewRelationship(heir.relationship);
    setIsAddModalOpen(true);
  };

  const handleSaveModal = () => {
    if (!newName.trim()) return;
    if (modalMode === 'add') {
      const newId = heirs.length > 0 ? Math.max(...heirs.map((h) => h.id)) + 1 : 1;
      setHeirs([...heirs, {
        id: newId, name: newName, relationship: newRelationship, percentage: 0,
        icon: <User className="h-5 w-5 text-hana-ez-600" />
      }]);
    } else {
      setHeirs(heirs.map(h => h.id === targetHeirId ? { ...h, name: newName.trim(), relationship: newRelationship } : h));
    }
    setIsAddModalOpen(false);
  };

  const confirmChange = () => {
    if (editingHeir) {
      setHeirs(heirs.map(h => h.id === editingHeir.id ? { ...h, percentage: Number(tempPercentage) } : h));
      setEditingHeir(null);
    }
  };

  if (loading) return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-hana-ez-600" />
      </div>
  );

  return (
      <div className="app-shell bg-white">
        <div className="app-layout">
          <Header title="상속 설계" showBackButton />

          <div className="app-main no-scrollbar px-6">
            <PageHeading className="mt-8 mb-6 !text-left text-2xl font-bold">
              상속 비율을{'\n'}자유롭게 조정해보세요
            </PageHeading>

            <div className="mb-8 flex justify-center">
              <Image src="/images/inheritance/intro-slide-3.png" alt="chart" width={200} height={200} />
            </div>

            <div className="mb-8 rounded-[24px] bg-hana-ez-50 p-6">
              <div className="flex justify-between text-sm text-hana-black-500 mb-2">
                <span>전체 상속 자산</span>
                <span className="font-bold text-hana-black-900">{totalAsset.toLocaleString()}억원</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-hana-ez-100">
                <span className="text-sm font-medium">설정된 비율 합계</span>
                <span className={`text-lg font-bold ${totalPercentage === 100 ? 'text-hana-green-700' : 'text-hana-ez-600'}`}>
                {totalPercentage}% <span className="text-hana-black-300 font-normal text-sm">/ 100%</span>
              </span>
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-10">
              {heirs.map((heir) => (
                  <div key={heir.id} className="relative overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm">
                    <div className="flex p-5" onClick={() => handleCardClick(heir)}>
                      <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-hana-ez-50">
                        {heir.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-hana-black-900">{heir.name}</span>
                          <span className="text-[11px] text-hana-black-400 bg-gray-50 px-2 py-0.5 rounded">
                        {RELATIONSHIPS.find(r => r.value === heir.relationship)?.label}
                      </span>
                        </div>
                        <div className="mt-1 text-xs text-hana-black-400">
                          약 {(totalAsset * (heir.percentage / 100)).toFixed(2)}억원
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-hana-ez-600">{heir.percentage}%</div>
                      </div>
                    </div>
                    <div className="flex border-t border-gray-50 bg-gray-50/30">
                      <button onClick={(e) => handleOpenEditModal(e, heir)} className="flex-1 py-2 text-[12px] text-gray-500 flex items-center justify-center gap-1">
                        <Edit2 size={12} /> 수정
                      </button>
                      <div className="w-[1px] bg-gray-100" />
                      <button onClick={(e) => { e.stopPropagation(); setHeirs(heirs.filter(h => h.id !== heir.id)); }} className="flex-1 py-2 text-[12px] text-red-400 flex items-center justify-center gap-1">
                        <Trash2 size={12} /> 삭제
                      </button>
                    </div>
                  </div>
              ))}

              <button onClick={handleOpenAddModal} className="flex h-14 w-full items-center justify-center gap-2 rounded-[20px] border-2 border-dashed border-gray-200 text-gray-400 transition-colors active:bg-gray-50">
                <Plus size={20} /> <span className="font-medium">상속인 추가하기</span>
              </button>
            </div>
          </div>

          <footer className="px-6 pb-10 pt-4 bg-white">
            <PrimaryButton
                label={submitting ? "" : (totalPercentage === 100 ? "설정 완료" : "비율의 합을 100%로 맞춰주세요")}
                disabled={totalPercentage !== 100 || submitting}
                icon={submitting && <Loader2 className="animate-spin" />}
                onClick={async () => {
                  setSubmitting(true);
                  try {
                    await submitInheritancePlan({ distributions: heirs.map(h => ({ heirUserId: h.userId || null, heirName: h.name, relation: h.relationship, distRatio: h.percentage })) });
                    router.push('/inheritance/result');
                  } catch { alert('오류가 발생했습니다.'); } finally { setSubmitting(false); }
                }}
            />
          </footer>

          {/* 비율 수정 바텀시트 (기존 인라인 모달을 바텀시트로 대체 권장) */}
          <BottomSheet isOpen={!!editingHeir} onClose={() => setEditingHeir(null)}>
            <div className="px-6 pb-10">
              <PageHeading className="!text-left text-xl mb-6">
                <span className="text-hana-ez-600">{editingHeir?.name}</span>님에게{'\n'}얼마를 상속할까요?
              </PageHeading>

              <FormInput
                  label="상속 비율"
                  id="percentage"
                  type="number"
                  value={tempPercentage}
                  onChange={setTempPercentage}
                  suffix={<span className="flex items-center pr-4 font-bold text-lg">%</span>}
                  error={Number(tempPercentage) < (currentEditingShares?.forcedPercentage || 0) ? `유류분(${currentEditingShares?.forcedPercentage}%)보다 적게 설정되었습니다.` : ''}
              />

              <div className="mt-4 flex items-center gap-2 text-[12px] text-hana-black-400">
                <TriangleAlert size={14} className="text-red-400" />
                최소 유류분 보장: <span className="font-bold text-red-500">{currentEditingShares?.forcedPercentage}%</span>
              </div>

              <div className="mt-8 flex gap-3">
                <PrimaryButton label="취소" variant="ghost" onClick={() => setEditingHeir(null)} />
                <PrimaryButton label="적용하기" onClick={confirmChange} />
              </div>
            </div>
          </BottomSheet>

          <BottomSheet isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
            <div className="px-6 pb-10">
              <PageHeading className="!text-left text-xl mb-6">
                {modalMode === 'add' ? '새로운 상속인 추가' : '상속인 정보 수정'}
              </PageHeading>

              <FormInput
                  label="이름"
                  id="heirName"
                  value={newName}
                  onChange={setNewName}
                  placeholder="이름을 입력해주세요"
                  className="mb-6"
              />

              <div className="mb-8">
                <label className="mb-2 block font-medium text-[15px] text-hana-black-800">가족 관계</label>
                <div className="grid grid-cols-4 gap-2">
                  {RELATIONSHIPS.map((rel) => (
                      <button
                          key={rel.value}
                          onClick={() => setNewRelationship(rel.value)}
                          className={`h-11 rounded-xl text-sm font-medium transition-all ${newRelationship === rel.value ? 'bg-hana-ez-600 text-white' : 'bg-gray-50 text-gray-500'}`}
                      >
                        {rel.label}
                      </button>
                  ))}
                </div>
              </div>

              <PrimaryButton
                  label={modalMode === 'add' ? '추가하기' : '수정하기'}
                  disabled={!newName.trim()}
                  onClick={handleSaveModal}
              />
            </div>
          </BottomSheet>
        </div>
      </div>
  );
}