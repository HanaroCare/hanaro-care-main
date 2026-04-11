import { User } from "lucide-react";
import type { Recipient } from "../../types";
import { formatAmount } from "../../utils/format";

interface Props {
  recipient: Recipient;
  onEdit: () => void;
}

export default function RecipientHeader({ recipient, onEdit }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#E9F8F9] flex items-center justify-center">
          <User className="w-5 h-5 text-hana-green-700" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">
            {recipient.name}
          </span>
          <span className="text-xs text-gray-400">
            {recipient.percentage}% · {formatAmount(recipient.amount)}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="text-sm pr-1 text-hana-green-700 font-medium hover:opacity-70 transition-opacity"
      >
        변경 &gt;
      </button>
    </div>
  );
}
