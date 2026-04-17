'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getBannerStatus } from '@/app/asset/actions/notificationStatus';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import CompleteStep from '@/components/modules/CompleteStep';
import AgencySelectStep from '../components/AgencySelectStep';
import ConsentStep from '../components/ConsentStep';
import IntroStep from '../components/IntroStep';
import LoadingStep from '../components/LoadingStep';
import SuccessModal from '../components/SuccessModal';
import { getConnectableAssets, updateAssetLinkStatus } from './actions/mydata';

type Step = 'consent' | 'intro' | 'select' | 'loading' | 'complete';

export default function MyDataConnectPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('consent');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState('사용자');

  useEffect(() => {
    getBannerStatus().then((s) => {
      if (s.userName) setUserName(s.userName);
    });
  }, []);

  const handleConsentNext = () => setStep('intro');

  const handleCustomSelectMode = () => setStep('select');

  const handleIntroConfirm = async () => {
    const accounts = await getConnectableAssets();
    await updateAssetLinkStatus(accounts.map((a) => a.accountId));
    setStep('loading');
  };

  const handleAgencySelectComplete = async (selectedIds: string[]) => {
    await updateAssetLinkStatus(selectedIds);
    setStep('loading');
  };

  const handleLoadingComplete = () => {
    setStep('complete');
    setIsModalOpen(true);
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    router.push('/mydata/house');
  };

  const handleModalClose = () => setIsModalOpen(false);

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
                  name={userName}
                  onConfirm={handleIntroConfirm}
                  onCustomMode={handleCustomSelectMode}
                />
              )}
              {step === 'select' && (
                <AgencySelectStep onNext={handleAgencySelectComplete} />
              )}
              {step === 'loading' && (
                <LoadingStep name={userName} onComplete={handleLoadingComplete} />
              )}

              {step === 'complete' && (
                <CompleteStep
                  footer={
                    <PrimaryButton
                      label="확인하기"
                      onClick={() => router.push('/asset')}
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
