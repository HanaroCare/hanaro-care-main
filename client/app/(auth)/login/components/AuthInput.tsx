import type {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  HTMLInputTypeAttribute,
} from "react";

type AuthInputProps = {
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  id: string;
  disabled?: boolean;
  autoComplete?: string;
};

export default function AuthInput({
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  onKeyDown,
  id,
  disabled = false,
  autoComplete,
}: AuthInputProps) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      disabled={disabled}
      autoComplete={autoComplete}
      className="h-[3.5rem] w-full rounded-[0.75rem] border border-gray-200 bg-white px-[1rem] text-[1rem] text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
    />
  );
}
