"use client";

import { Check } from "lucide-react";

type Term = {
  id: string;
  label: string;
  required: boolean;
};

type TermsAgreementProps = {
  terms: Term[];
  checkedIds: string[];
  onToggleAll: (checked: boolean) => void;
  onToggleItem: (id: string) => void;
};

export default function TermsAgreement({
  terms,
  checkedIds,
  onToggleAll,
  onToggleItem,
}: TermsAgreementProps) {
  const isAllChecked = terms.length > 0 && checkedIds.length === terms.length;

  return (
    <div className="flex flex-col gap-[1.5rem]">
      <button
        type="button"
        role="checkbox"
        aria-checked={isAllChecked}
        onClick={() => onToggleAll(!isAllChecked)}
        className="flex items-center gap-[0.75rem] p-[1rem] rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors bg-white shadow-sm focus-visible:ring-2 focus-visible:ring-hana-ez-600 outline-none"
      >
        <div
          className={`w-[1.5rem] h-[1.5rem] rounded-full flex items-center justify-center border-2 transition-colors ${isAllChecked
            ? "bg-hana-ez-600 border-hana-ez-600 text-white"
            : "border-gray-200 text-transparent bg-white"
            }`}
        >
          <Check size={14} strokeWidth={4} />
        </div>
        <span className="text-[1.1rem] font-bold text-gray-900">전체 동의</span>
      </button>

      <div className="flex flex-col gap-[1.25rem] px-[0.25rem]">
        {terms.map((term) => {
          const isChecked = checkedIds.includes(term.id);
          return (
            <button
              key={term.id}
              type="button"
              role="checkbox"
              aria-checked={isChecked}
              onClick={() => onToggleItem(term.id)}
              className="flex items-center gap-[0.75rem] cursor-pointer group focus-visible:outline-none focus-visible:underline text-left"
            >
              <div
                className={`w-[1.5rem] h-[1.5rem] shrink-0 rounded-full flex items-center justify-center border-2 transition-colors ${isChecked
                  ? "bg-hana-ez-600 border-hana-ez-600 text-white"
                  : "border-gray-200 text-transparent bg-white"
                  }`}
              >
                <Check size={14} strokeWidth={4} />
              </div>
              <div className="flex items-center gap-[0.25rem] text-[0.9rem]">
                <span
                  className={
                    term.required
                      ? "text-hana-ez-600 font-semibold"
                      : "text-gray-400"
                  }
                >
                  [{term.required ? "필수" : "선택"}]
                </span>
                <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                  {term.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}