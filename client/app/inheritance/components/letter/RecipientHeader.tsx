import { User } from 'lucide-react';
import type { InheritanceSummaryDto } from '../../letter/types';
import { formatAmount } from '../../utils/format';

interface Props {
  recipient: InheritanceSummaryDto;
  onEdit: () => void;
}

export default function RecipientHeader({ recipient, onEdit }: Props) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E9F8F9]">
          <User className="h-5 w-5 text-hana-green-700" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 text-sm">
            {recipient.username}
          </span>
          <span className="text-gray-400 text-xs">
            {recipient.percent}% · {formatAmount(recipient.amt)}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="pr-1 font-medium text-hana-green-700 text-sm transition-opacity hover:opacity-70"
      >
        변경 &gt;
      </button>
    </div>
  );
}
