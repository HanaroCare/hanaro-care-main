interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function NicknameInput({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="nickname" className="font-semibold text-gray-900 text-sm">
        받는 분의 이름이나 별칭
      </label>
      <div id="nickname" className="font-semibold text-gray-900 text-sm">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="예: 여보, 엄마"
          className="w-full border-gray-200 border-b bg-transparent py-2 text-gray-800 text-sm outline-none transition-colors placeholder:text-gray-300 focus:border-teal-400"
        />
      </div>
    </div>
  );
}
