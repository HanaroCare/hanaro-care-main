import { User } from "lucide-react";
import type { Recipient } from "../../types";
import { formatAmount } from "../../utils/format";

export function RecipientCard({
  recipient,
  onClick,
}: {
  recipient: Recipient;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm"
    >
      {/* Left: icon + name */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center">
          <User className="w-5 h-5 text-teal-500" strokeWidth={1.5} />
        </div>
        <span className="text-sm font-medium text-gray-800">
          {recipient.code}
        </span>
      </div>

      {/* Right: percentage + amount */}
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-sm font-bold text-teal-500">
          {recipient.percentage}%
        </span>
        <span className="text-xs text-gray-400">
          {formatAmount(recipient.amount)}
        </span>
      </div>
    </button>
  );
}
