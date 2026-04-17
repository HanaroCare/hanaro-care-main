interface Props {
  value: number | null;
  onChange: (value: number | null) => void;
}

export default function YearsInput({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-semibold text-gray-900 text-sm">
        몇 년 후 전달할까요?
      </span>
      <label className="flex cursor-text items-center justify-end gap-2 py-2">
        <input
          type="number"
          min={0}
          value={value ?? ''}
          onChange={(e) =>
            onChange(e.target.value === '' ? null : Number(e.target.value))
          }
          className="mr-2 w-73 flex-1 border-gray-200 border-b bg-transparent pb-1 text-right text-gray-800 text-sm outline-none focus-within:border-teal-400"
        />
        <span className="pr-2 pb-1 text-gray-400 text-sm">년 후</span>
      </label>
    </div>
  );
}
