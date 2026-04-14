'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import CompleteStep from '@/components/modules/CompleteStep';
import AgencySelectStep from '../components/AgencySelectStep';
import ConsentStep from '../components/ConsentStep';
import IntroStep from '../components/IntroStep';
import LoadingStep from '../components/LoadingStep';
import SuccessModal from '../components/SuccessModal';

type Step = 'consent' | 'intro' | 'select' | 'loading' | 'complete';

export default function MyDataConnectPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('consent');
  const [isCustomSelection, setIsCustomSelection] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConsentNext = () => {
    setIsCustomSelection(false);
    setStep('intro');
  };

  const handleCustomSelectMode = () => {
    setIsCustomSelection(true);
    setStep('select');
  };

  const handleIntroConfirm = () => setStep('loading');
  const handleAgencySelectComplete = () => setStep('loading');

  const handleLoadingComplete = () => {
    setStep('complete');
    setIsModalOpen(true);
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    router.push('/mydata/house');
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="app-shell bg-background">
      <div className="app-layout relative overflow-hidden">
        <div className="relative flex flex-1 flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-1 flex-col"
            >
              {step === 'consent' && <ConsentStep onNext={handleConsentNext} />}
              {step === 'intro' && (
                <IntroStep
                  onConfirm={handleIntroConfirm}
                  onCustomMode={handleCustomSelectMode}
                />
              )}
              {step === 'select' && (
                <AgencySelectStep onNext={handleAgencySelectComplete} />
              )}
              {step === 'loading' && (
                <LoadingStep onComplete={handleLoadingComplete} />
              )}

              {step === 'complete' && (
                <CompleteStep
                  footer={
                    <PrimaryButton
                      label="확인하기"
                      onClick={() => router.push('/mydata/main')}
                    />
                  }
                >
                  <div className="flex flex-col items-center text-center">
                    <h2 className="whitespace-pre-line font-bold text-[1.5rem] text-foreground leading-[1.4] tracking-tight">
                      금융 자산을{'\n'}모두 불러왔어요
                    </h2>
                    <p className="mt-3 text-[1rem] text-muted-foreground">
                      이제 흩어져 있던 내 돈을{'\n'}한눈에 관리할 수 있어요.
                    </p>
                  </div>
                </CompleteStep>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <SuccessModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
        />
      </div>
    </div>
  );
}
