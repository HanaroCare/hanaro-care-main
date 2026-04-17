'use client';

import { Heir } from '../../plan/[planId]/InheritancePlanClient';

export default function EditHeirModal({
  editingHeir,
  setEditingHeir,
  heirs,
  setHeirs,
  tempPercentage,
  setTempPercentage,
}: {
  editingHeir: Heir | null;
  setEditingHeir: (h: Heir | null) => void;
  heirs: Heir[];
  setHeirs: React.Dispatch<React.SetStateAction<Heir[]>>;
  tempPercentage: number;
  setTempPercentage: (v: number) => void;
}) {
  if (!editingHeir) return null;

  const otherTotal = heirs
    .filter((h) => h.id !== editingHeir.id)
    .reduce((a, b) => a + b.percentage, 0);

  const maxVal = 100 - otherTotal;

  const confirm = () => {
    setHeirs((prev) =>
      prev.map((h) =>
        h.id === editingHeir.id ? { ...h, percentage: tempPercentage } : h,
      ),
    );

    setEditingHeir(null);
  };

  return (
    <div style={{ border: '1px solid black', padding: 16 }}>
      <h3>{editingHeir.name} 수정</h3>

      <input
        type="number"
        value={tempPercentage}
        max={maxVal}
        onChange={(e) => {
          const v = Number(e.target.value);
          setTempPercentage(v > maxVal ? maxVal : v);
        }}
      />

      <div>최대 가능: {maxVal}%</div>

      <button onClick={() => setEditingHeir(null)}>취소</button>
      <button onClick={confirm}>적용</button>
    </div>
  );
}
