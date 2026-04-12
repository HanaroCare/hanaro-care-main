import { Mic, Pencil } from "lucide-react";

const MAX_LENGTH = 100;

interface Props {
  value: string;
  onChange: (value: string) => void;
  onVoice: () => void;
}

export default function MessageInput({ value, onChange, onVoice }: Props) {
  return (
    <div className="border border-gray-300 rounded-2xl px-4 pt-4 pb-3 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Pencil className="w-4 h-4 text-hana-green-700" strokeWidth={1.5} />
        <span className="text-sm font-semibold text-gray-900">
          한마디 남기기
        </span>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={MAX_LENGTH}
        placeholder="소중한 마음을 담아보세요"
        rows={4}
        className="bg-transparent text-sm text-gray-700 placeholder:text-gray-300 outline-none resize-none leading-relaxed"
      />
      <div className="border-t pb-2" />
      <div className="flex items-center justify-between pt-3 pb-2">
        <button
          type="button"
          onClick={onVoice}
          className="flex items-center gap-1.5 text-xs font-semibold text-hana-green-700 hover:opacity-70 transition-opacity leading-4"
        >
          <Mic className="w-4 h-4 shrink-0 block" strokeWidth={1.5} />
          녹음으로 대신하기
        </button>
        <span className="text-xs text-gray-400">
          {value.length}/{MAX_LENGTH}
        </span>
      </div>
    </div>
  );
}
