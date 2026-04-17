'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  getInheritanceContext,
  submitInheritancePlan,
  type HeirDistribution,
} from '@/app/inheritance/actions/plan';
import SummaryCard from '../../components/letter/SummaryCard';
import HeirList from '../../components/letter/HeirList';
import EditHeirModal from '../../components/letter/EditHeirModal';
import AddHeirBottomSheet from '../../components/letter/AddHeirBottomSheet';

export type Heir = {
  id: number;
  userId?: number;
  name: string;
  relationship: 'SPOUSE' | 'CHILD' | 'PARENT' | 'FAMILY';
  percentage: number;
};

export default function InheritancePlanClient() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [totalAsset, setTotalAsset] = useState(0);
  const [heirs, setHeirs] = useState<Heir[]>([]);

  const [editingHeir, setEditingHeir] = useState<Heir | null>(null);
  const [tempPercentage, setTempPercentage] = useState(0);

  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const context = await getInheritanceContext();

      setTotalAsset(context.assetSummary.totalAsset / 100000000);

      setHeirs(
        context.familyMembers.map((m, i) => ({
          id: i + 1,
          userId: m.userId,
          name: m.userNm,
          relationship: m.relationCd,
          percentage: 0,
        })),
      );

      setLoading(false);
    })();
  }, []);

  const totalPercentage = useMemo(
    () => heirs.reduce((a, b) => a + b.percentage, 0),
    [heirs],
  );

  const handleComplete = async () => {
    if (totalPercentage !== 100) return;

    setSubmitting(true);

    try {
      const distributions: HeirDistribution[] = heirs.map((h) => ({
        heirUserId: h.userId || null,
        heirName: h.name,
        relation: h.relationship,
        distRatio: h.percentage,
      }));

      await submitInheritancePlan({ distributions });

      router.push('/inheritance/result');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <SummaryCard totalAsset={totalAsset} totalPercentage={totalPercentage} />

      <HeirList
        heirs={heirs}
        setHeirs={setHeirs}
        setEditingHeir={setEditingHeir}
        setIsAddOpen={setIsAddOpen}
      />

      <EditHeirModal
        editingHeir={editingHeir}
        setEditingHeir={setEditingHeir}
        heirs={heirs}
        setHeirs={setHeirs}
        tempPercentage={tempPercentage}
        setTempPercentage={setTempPercentage}
      />

      <AddHeirBottomSheet
        open={isAddOpen}
        setOpen={setIsAddOpen}
        setHeirs={setHeirs}
      />

      <button
        disabled={totalPercentage !== 100 || submitting}
        onClick={handleComplete}
      >
        {submitting ? '저장중...' : '설정 완료'}
      </button>
    </>
  );
}
