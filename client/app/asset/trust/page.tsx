"use client";

import Image from "next/image";
import { CircleCheck } from "lucide-react";
import { useRouter } from "next/navigation";

const benefits = [
  {
    title: "병원비 걱정 없어요",
    desc: "치매가 와도 병원비, 요양비가 자동으로 지급돼요",
  },
  {
    title: "전문가가 대신 굴려줘요",
    desc: "내 돈이 잠자지 않아요",
  },
  {
    title: "자녀에게 원하는 대로 남겨요",
    desc: "내가 정한대로 상속돼요",
  },
];

export default function TrustPage() {
  const router = useRouter();
  return (
    <div className="app-shell">
      <div className="app-layout">
        <main className="app-main no-scrollbar">
          <section className="px-[25px] pt-6">
            <p className="mb-1 text-[12px] leading-[18px] font-normal text-[#6A7282]">
              내맘대로신탁
            </p>

            <h1 className="m-0 text-[28px] leading-[42px] font-bold text-[#101828]">
              치매가 와도
              <br />내 돈은 내뜻대로
            </h1>

            <div className="mt-2 flex justify-center">
              <Image
                src="/images/trust.png"
                alt="가족 일러스트"
                width={240}
                height={226}
                className="h-[226px] w-60 object-contain"
                priority
              />
            </div>
          </section>

          <section className="px-[25px] pt-5 pb-6">
            <h2 className="ml-1.5 mb-3 text-[16px] leading-6 font-medium tracking-[-0.64px] text-black">
              이런 점이 좋아요
            </h2>

            <div className="flex flex-col gap-7 rounded-4xl bg-hana-silver-50 px-[27px] py-[25px]">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-[9px]">
                  <div className="mt-0.5 shrink-0">
                    <CircleCheck size={20} className="text-[#4A5565]" />
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <p className="m-0 text-[16px] leading-[22px] font-medium tracking-[-0.04em] text-hana-black-800">
                      {benefit.title}
                    </p>
                    <p className="m-0 text-[12px] leading-[18px] font-normal tracking-[-0.04em] text-hana-black-800">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="flex shrink-0 gap-[11px] bg-white px-[22px] pt-3 pb-4">
          <button
            type="button"
            className="h-[53px] flex-1 rounded-lg bg-[#E9F8F9] text-[16px] leading-5 font-semibold tracking-[-0.15px] text-hana-green-700"
          >
            상담 신청
          </button>
          <button
            type="button"
            onClick={() => router.push("/asset/trust/select-assets")}
            className="h-[53px] flex-1 rounded-lg bg-hana-ez-600 text-[16px] leading-5 font-semibold tracking-[-0.15px] text-white"
          >
            상품 비교
          </button>
        </footer>
      </div>
    </div>
  );
}
