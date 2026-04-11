interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function NicknameInput({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-gray-900">
        받는 분의 이름이나 별칭
      </span>
      <label
        htmlFor="nickname"
        className="text-sm font-semibold  text-gray-900"
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="예: 여보, 엄마"
          className="border-b w-full border-gray-200 py-2 text-sm text-gray-800 placeholder:text-gray-300 outline-none focus:border-teal-400 transition-colors bg-transparent"
        />
      </label>
    </div>
  );
}
