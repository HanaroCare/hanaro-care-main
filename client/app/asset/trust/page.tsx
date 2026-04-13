'use client';

import { CircleCheck } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DualActionFooter from '@/components/modules/DualActionFooter';
import Header from '@/components/navigation/Header';

const benefits = [
  {
    title: '병원비 걱정 없어요',
    desc: '치매가 와도 병원비, 요양비가 자동으로 지급돼요',
  },
  {
    title: '전문가가 대신 굴려줘요',
    desc: '내 돈이 잠자지 않아요',
  },
  {
    title: '자녀에게 원하는 대로 남겨요',
    desc: '내가 정한대로 상속돼요',
  },
];

export default function TrustPage() {
  const router = useRouter();
  return (
    <div className="app-shell">
      <div className="app-layout">
        <Header title="내맘대로신탁" />
        <main className="app-main no-scrollbar">
          <section className="px-6.25 pt-6">
            <p className="mb-1 font-normal text-[#6A7282] text-[12px] leading-4.5">
              내맘대로신탁
            </p>

            <h1 className="m-0 font-bold text-[#101828] text-[28px] leading-10.5">
              치매가 와도
              <br />내 돈은 내뜻대로
            </h1>

            <div className="mt-2 flex justify-center">
              <Image
                src="/images/asset/trust.svg"
                alt="가족 일러스트"
                width={240}
                height={226}
                className="h-56.5 w-60 object-contain"
                priority
              />
            </div>
          </section>

          <section className="px-6.25 pt-5 pb-6">
            <h2 className="mb-3 ml-1.5 font-medium text-[16px] text-black leading-6 tracking-[-0.64px]">
              이런 점이 좋아요
            </h2>

            <div className="flex flex-col gap-7 rounded-4xl bg-hana-silver-50 px-6.75 py-6.25">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-2.25">
                  <div className="mt-0.5 shrink-0">
                    <CircleCheck size={20} className="text-[#4A5565]" />
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <p className="m-0 font-medium text-[16px] text-hana-black-800 leading-5.5 tracking-[-0.04em]">
                      {benefit.title}
                    </p>
                    <p className="m-0 font-normal text-[12px] text-hana-black-800 leading-4.5 tracking-[-0.04em]">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <DualActionFooter
          leftLabel="상담 신청"
          rightLabel="상품 비교"
          onRightClick={() => router.push('/asset/trust/select-assets')}
        />
      </div>
    </div>
  );
}
