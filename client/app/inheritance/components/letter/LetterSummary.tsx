import { Download, Send } from "lucide-react";
import type { InheritanceMethod } from "../../types";
import { formatAmount } from "../../utils/format";

interface Props {
  relationCode: string;
  distRatio: number;
  amount: number;
  deliverAfterYears: number | null;
  letterType: "LETTER" | "VOICE";
  inheritanceMethod: InheritanceMethod;
  onImageSave: () => void;
  onShare: () => void;
}

const METHOD_LABEL: Record<InheritanceMethod, string> = {
  once: "한번에 전달",
  divided: "나눠서 전달",
};

export default function LetterSummary({
  relationCode,
  distRatio,
  deliverAfterYears,
  letterType,
  amount,
  inheritanceMethod,
  onImageSave,
  onShare,
}: Props) {
  return (
    <div className="w-full border border-gray-200 rounded-2xl px-5 py-4 flex flex-col gap-3">
      {/* 상단 정보 */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          {relationCode} ( {distRatio}% )
        </span>
        <span className="text-sm font-semibold text-gray-900">
          {formatAmount(amount)}
        </span>
      </div>

      {/* 전달 조건 */}
      <p className="text-xs text-gray-400">
        {deliverAfterYears ? `${deliverAfterYears}년 후` : "즉시"} ·{" "}
        {METHOD_LABEL[inheritanceMethod]}
      </p>

      {/* 버튼 */}
      <div className="flex gap-3 mt-1">
        {letterType === "LETTER" && (
          <button
            type="button"
            className="flex-1 p-2 flex rounded-xl text-sm items-center gap-2 border-2 border-gray-200"
            onClick={onImageSave}
          >
            <Download className="m-2 w-4 h-4" />
            이미지 저장
          </button>
        )}
        <button
          type="button"
          className="flex-1 flex p-2 rounded-xl justify-center items-center text-sm gap-3 border-2 border-gray-200"
          onClick={onShare}
        >
          <Send className="m-2 mr-0 w-4 h-4" />
          공유하기
        </button>
      </div>
    </div>
  );
}
