'use client';

import { Heir } from '../../plan/[planId]/InheritancePlanClient';

export default function HeirList({
  heirs,
  setHeirs,
  setEditingHeir,
  setIsAddOpen,
}: {
  heirs: Heir[];
  setHeirs: React.Dispatch<React.SetStateAction<Heir[]>>;
  setEditingHeir: (h: Heir | null) => void;
  setIsAddOpen: (v: boolean) => void;
}) {
  return (
    <div>
      {heirs.map((heir) => (
        <div
          key={heir.id}
          onClick={() => setEditingHeir(heir)}
          style={{
            padding: 12,
            borderBottom: '1px solid #ddd',
            cursor: 'pointer',
          }}
        >
          {heir.name} - {heir.percentage}%
        </div>
      ))}

      <button onClick={() => setIsAddOpen(true)}>+ 상속인 추가</button>
    </div>
  );
}
