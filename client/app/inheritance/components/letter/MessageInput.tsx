import { Mic, Pencil } from 'lucide-react';

const MAX_LENGTH = 100;

interface Props {
  value: string;
  onChange: (value: string) => void;
  onVoice: () => void;
}

export default function MessageInput({ value, onChange, onVoice }: Props) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-gray-300 px-4 pt-4 pb-3">
      <div className="flex items-center gap-2">
        <Pencil className="h-4 w-4 text-hana-green-700" strokeWidth={1.5} />
        <span className="font-semibold text-gray-900 text-sm">
          한마디 남기기
        </span>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={MAX_LENGTH}
        placeholder="소중한 마음을 담아보세요"
        rows={4}
        className="resize-none bg-transparent text-gray-700 text-sm leading-relaxed outline-none placeholder:text-gray-300"
      />
      <div className="border-t pb-2" />
      <div className="flex items-center justify-between pt-3 pb-2">
        <button
          type="button"
          onClick={onVoice}
          className="flex items-center gap-1.5 font-semibold text-hana-green-700 text-xs leading-4 transition-opacity hover:opacity-70"
        >
          <Mic className="block h-4 w-4 shrink-0" strokeWidth={1.5} />
          녹음으로 대신하기
        </button>
        <span className="text-gray-400 text-xs">
          {value.length}/{MAX_LENGTH}
        </span>
      </div>
    </div>
  );
}
