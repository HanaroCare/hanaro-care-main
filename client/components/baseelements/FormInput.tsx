'use client';

type FormInputProps = {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  suffix?: React.ReactNode;
  error?: string;
};

export default function FormInput({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  suffix,
  error,
}: FormInputProps) {
  const inputBaseClass =
    'h-14 w-full rounded-[10px] border px-4 text-[16px] outline-none transition-all';
  const stateClass = error
    ? 'border-hana-red-500 focus:border-hana-red-500'
    : 'border-border-gray focus:border-hana-teal-400';

  return (
    <div className={`flex flex-col ${className}`}>
      <label
        htmlFor={id}
        className="mb-2 block font-medium text-[15px] text-hana-black-800"
      >
        {label}
      </label>
      <div className="relative flex gap-2">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`${inputBaseClass} ${stateClass} ${suffix ? 'pr-12' : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {suffix && <div className="shrink-0">{suffix}</div>}
      </div>
      {error && (
        <span className="mt-1 text-[12px] text-hana-red-500">{error}</span>
      )}
    </div>
  );
}
