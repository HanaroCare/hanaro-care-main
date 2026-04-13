'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import Header from '@/components/navigation/Header';
import TrustChoiceStep from '../../components/trust/TrustChoiceStep';
import TrustProgressBar from '../../components/trust/TrustProgressBar';
import TrustStepLayout from '../../components/trust/TrustStepLayout';

const options = [
  {
    id: 'free',
    emoji: '🧑‍💼',
    title: '자유형',
    desc: '원할때 받기',
  },
  {
    id: 'pension',
    emoji: '🧑‍💼',
    title: '연금형',
    desc: '연금 형태로 받기',
  },
];

export default function PayoutTypePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>('free');

  return (
    <TrustStepLayout
      footer={
        <footer className="shrink-0 bg-white px-6 pt-10 pb-8">
          <PrimaryButton
            label="다음으로"
            disabled={!selected}
            onClick={() => router.push('/asset/trust/payout-use')}
          />
        </footer>
      }
    >
      <Header title="내맘대로신탁" />

      <section className="px-6 pt-8">
        <TrustProgressBar step={4} />

        <TrustChoiceStep
          question={
            <>
              어떤 형태로
              <br />
              자산을 받을까요?
            </>
          }
          options={options}
          selected={selected}
          onSelect={setSelected}
        />
      </section>
    </TrustStepLayout>
  );
}
