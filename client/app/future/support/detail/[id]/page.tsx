"use client";

import { ExternalLink } from "lucide-react";
import { use } from "react";
import Header from "@/components/navigation/Header";

interface DetailItem {
  label: string;
  value: string;
}

interface SupportDetail {
  id: number;
  title: string;
  subtitle: string;
  details: DetailItem[];
  applyUrl: string;
}

const supportDetails: Record<number, SupportDetail> = {
  1: {
    id: 1,
    title: "돌봄플러스 케어",
    subtitle: "65세 이상 독거노인 대상 맞춤형 돌봄 서비스입니다.",
    details: [
      { label: "대상", value: "만 65세 이상 독거노인 (기초생활수급자 우선)" },
      {
        label: "혜택 내용",
        value: "주 3회 방문 케어, 생활 상담, 건강 체크, 응급 연락 서비스",
      },
      {
        label: "신청 방법",
        value: "관할 주민센터 방문 또는 복지로(www.bokjiro.go.kr) 온라인 신청",
      },
    ],
    applyUrl: "https://www.bokjiro.go.kr",
  },
  2: {
    id: 2,
    title: "노인 맞춤 돌봄",
    subtitle:
      "일상생활 지원이 필요한 어르신에게 안전지원, 사회참여 서비스를 제공합니다.",
    details: [
      { label: "대상", value: "만 65세 이상 국민기초생활수급자, 차상위계층" },
      {
        label: "혜택 내용",
        value: "안전지원, 사회참여, 생활교육, 일상생활 지원 서비스",
      },
      {
        label: "신청 방법",
        value: "관할 주민센터 방문 또는 복지로 온라인 신청",
      },
    ],
    applyUrl: "https://www.bokjiro.go.kr",
  },
  3: {
    id: 3,
    title: "치매안심센터 지원",
    subtitle:
      "치매 조기 검진 및 예방, 치매 환자 및 가족 지원 서비스를 제공합니다.",
    details: [
      {
        label: "대상",
        value: "치매 위험군 어르신 및 치매 환자, 가족 돌봄자",
      },
      {
        label: "혜택 내용",
        value:
          "치매 조기 검진, 예방 프로그램, 치료비 지원, 가족 상담 및 교육",
      },
      {
        label: "신청 방법",
        value: "가까운 치매안심센터 방문 신청 (전국 256개소 운영)",
      },
    ],
    applyUrl: "https://www.nid.or.kr",
  },
  4: {
    id: 4,
    title: "노인 의료비 지원",
    subtitle: "저소득 어르신 대상 의료비 본인부담금 지원 서비스입니다.",
    details: [
      {
        label: "대상",
        value: "만 65세 이상 기초생활수급자 및 차상위계층 어르신",
      },
      {
        label: "혜택 내용",
        value:
          "의료비 본인부담금 경감, 건강검진비 지원, 틀니·보청기 급여 지원",
      },
      {
        label: "신청 방법",
        value: "관할 주민센터 방문 또는 복지로(www.bokjiro.go.kr) 온라인 신청",
      },
    ],
    applyUrl: "https://www.bokjiro.go.kr",
  },
  5: {
    id: 5,
    title: "하나 더 넥스트 케어",
    subtitle: "하나은행 고객 대상 프리미엄 시니어 케어 서비스입니다.",
    details: [
      {
        label: "대상",
        value: "하나은행 프리미엄 고객 (자산 기준 충족 시)",
      },
      {
        label: "혜택 내용",
        value:
          "건강관리 컨시어지, 법률·세무 전문 상담, 생활 지원, 전담 PB 매니저 서비스",
      },
      {
        label: "신청 방법",
        value: "가까운 하나은행 영업점 방문 또는 하나원큐 앱에서 신청",
      },
    ],
    applyUrl: "https://www.hanabank.com",
  },
  6: {
    id: 6,
    title: "하나 시니어 클럽",
    subtitle:
      "60세 이상 하나은행 고객을 위한 맞춤형 금융·생활 서비스입니다.",
    details: [
      {
        label: "대상",
        value: "만 60세 이상 하나은행 고객",
      },
      {
        label: "혜택 내용",
        value:
          "맞춤형 시니어 금융 상품, 생활 편의 서비스, 문화·교육 프로그램 무료 제공",
      },
      {
        label: "신청 방법",
        value: "가까운 하나은행 영업점 방문 또는 하나원큐 앱에서 신청",
      },
    ],
    applyUrl: "https://www.hanabank.com",
  },
};

export default function SupportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = use(params);
  const id = Number(idParam);
  const detail = supportDetails[id];

  if (!detail) return null;

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col">
      <Header title="나를 위한 제도" />

      <div className="flex flex-col flex-1 px-[25px] pt-[20px]">
        <h1 className="font-bold text-[22px] leading-[33px] text-[#1A212D] mt-[87px]">
          {detail.title}
        </h1>
        <p className="font-normal text-[14px] leading-[21px] text-[#535C6A] mt-[8px]">
          {detail.subtitle}
        </p>

        <div className="border border-[#E3E5E8] rounded-xl px-[17px] py-[24px] mt-[40px] flex flex-col gap-[25px]">
          {detail.details.map((item) => (
            <div key={item.label} className="flex flex-col gap-[3px]">
              <span className="font-semibold text-[13px] leading-[21px] text-[#1A212D]">
                {item.label}
              </span>
              <span className="font-normal text-[12px] leading-[21px] text-[#6B7280]">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-[25px] pb-[40px]">
        <button
          onClick={() =>
            window.open(detail.applyUrl, "_blank", "noopener,noreferrer")
          }
          className="flex flex-row items-center justify-center gap-[8px] w-full h-[53px] rounded-[10px] font-semibold text-[16px] text-white"
          style={{ backgroundColor: "#01A5AC" }}
        >
          <ExternalLink size={16} color="white" />
          신청하기
        </button>
      </div>
    </div>
  );
}
