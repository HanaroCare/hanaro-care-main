'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import PrimaryButton from '@/components/button/PrimaryButton';

const MockUser = {
  name: '권하나',
};
// TODO: 공컴
export default function InheritanceLetter() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center bg-white font-pretendard">
      <div className="flex w-full max-w-107.5 flex-col bg-white">
        <main className="flex flex-1 flex-col items-center px-5.5">
          <h2 className="mt-23 max-w-66.75 text-center font-semibold text-5 text-[#1A212D] leading-7.5">
            {MockUser.name} 손님의 소중한 사람들에게
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
