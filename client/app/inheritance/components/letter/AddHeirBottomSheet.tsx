'use client';

import { useState } from 'react';
import type { Heir } from '../../plan/[planId]/InheritancePlanClient';

export default function AddHeirBottomSheet({
  open,
  setOpen,
  setHeirs,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  setHeirs: React.Dispatch<React.SetStateAction<Heir[]>>;
}) {
  const [name, setName] = useState('');

  if (!open) return null;

  const addHeir = () => {
    setHeirs((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name,
        relationship: 'CHILD',
        percentage: 0,
      },
    ]);

    setName('');
    setOpen(false);
  };

  return (
    <div style={{ borderTop: '2px solid black', padding: 16 }}>
      <h3>상속인 추가</h3>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름"
      />

      <button onClick={addHeir}>추가</button>
      <button onClick={() => setOpen(false)}>닫기</button>
    </div>
  );
}
