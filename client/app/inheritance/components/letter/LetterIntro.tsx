'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import { AlertBanner } from '@/components/modules/AlertBanner';

export default function InheritanceLetter({ userName }: { userName: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (searchParams.get('deleted') === 'true') {
      setShow(true);
      router.replace('/inheritance/letter');
    }
  }, [router, searchParams]);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <div className="flex min-h-[calc(100vh-155px)] flex-col items-center bg-white font-pretendard">
      <div className="flex w-full max-w-107.5 flex-col bg-white">
        <AnimatePresence>
          {show && (
            <motion.div
              key="alert"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="-translate-x-1/2 fixed top-20 left-1/2 z-50"
            >
              <AlertBanner message="편지가 삭제되었습니다" variant="warning" />
            </motion.div>
          )}
        </AnimatePresence>
        <main className="flex flex-1 flex-col items-center px-5.5">
          <h2 className="mt-23 max-w-66.75 text-center font-semibold text-[#1A212D] text-xl leading-7.5">
            {userName} 손님의 소중한 사람들에게
            <br />
            상속편지를 보내볼까요?
          </h2>

          <div className="mt-6 w-full">
            <Image
              src="/images/inheritance/letter_none.svg"
              alt="상속 편지 일러스트"
              width={654}
              height={700}
              className="w-full rounded-xl object-cover"
              priority
            />
          </div>
        </main>
      </div>
      <PrimaryButton
        onClick={() => router.push('/inheritance/letter/recipients')}
        label={'편지 작성하기'}
      />
    </div>
  );
}
