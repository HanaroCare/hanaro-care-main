import { User } from 'lucide-react';
import type { InheritanceSummaryDto } from '../../inheritApi';
import { formatAmount } from '../../utils/format';

export function RecipientCard({
  recipient,
  onClick,
}: {
  recipient: InheritanceSummaryDto;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm"
    >
      {/* Left: icon + name */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50">
          <User className="h-5 w-5 text-teal-500" strokeWidth={1.5} />
        </div>
        <span className="font-medium text-gray-800 text-sm">
          {recipient.username}
        </span>
      </div>

      {/* Right: percentage + amount */}
      <div className="flex flex-col items-end gap-0.5">
        <span className="font-bold text-sm text-teal-500">
          {recipient.percent}%
        </span>
        <span className="text-gray-400 text-xs">
          {formatAmount(recipient.amt)}
        </span>
      </div>
    </button>
  );
}
