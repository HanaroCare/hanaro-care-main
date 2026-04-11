"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "../components/letter/Header";

const MockUser = {
  name: "권하나",
};
// TODO: 공컴
export default function InheritanceLetter() {
  const router = useRouter();

  return (
    <div className="bg-white flex flex-col items-center font-pretendard">
      <div className="w-full max-w-107.5 flex flex-col bg-white">
        <main className="flex flex-col items-center flex-1 px-5.5">
          <h2 className="mt-23 text-[#1A212D] text-center font-semibold leading-7.5 max-w-66.75 text-5">
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

        <div className="w-full px-5.5 py-4 bg-white">
          <button
            type="button"
            className="w-full py-4 rounded-[10px] bg-[#01A5AC] text-white text-base font-medium transition-opacity hover:opacity-90 active:opacity-80"
            onClick={() => router.push("/inheritance/letter/recipients")}
          >
            편지 작성하기
          </button>
        </div>
      </div>
    </div>
  );
}
