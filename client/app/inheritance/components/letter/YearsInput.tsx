interface Props {
  value: number | null;
  onChange: (value: number | null) => void;
}

export default function YearsInput({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-gray-900">
        몇 년 후 전달할까요?
      </span>
      <label className="flex items-center justify-end py-2 gap-2 cursor-text ">
        <input
          type="number"
          min={0}
          value={value ?? ""}
          onChange={(e) =>
            onChange(e.target.value === "" ? null : Number(e.target.value))
          }
          className="flex-1 w-73 mr-2 pb-1 text-right text-sm text-gray-800 border-b border-gray-200 focus-within:border-teal-400 outline-none bg-transparent"
        />
        <span className="text-sm pr-2 pb-1 text-gray-400">년 후</span>
      </label>
    </div>
  );
}
