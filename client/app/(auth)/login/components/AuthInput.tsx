import type { ChangeEvent, HTMLInputTypeAttribute } from "react";

type AuthInputProps = {
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  id: string;
};

/**
 * 로그인용 공통 입력 필드 컴포넌트
 */
export default function AuthInput({
  type = "text",
  placeholder,
  value,
  onChange,
  id,
}: AuthInputProps) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="h-[3.5rem] w-full rounded-[0.75rem] border border-gray-200 bg-white px-[1rem] text-[1rem] text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
    />
  );
}
