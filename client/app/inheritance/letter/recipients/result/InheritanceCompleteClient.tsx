'use client';

import LetterResult from '@/app/inheritance/components/letter/LetterResult';

export default function InheritanceCompleteClient({
  result,
  method,
}: {
  result: any;
  method: 'once' | 'divided';
}) {
  return (
    <div className="flex min-h-full flex-col items-center bg-white">
      <div className="flex min-h-full w-full flex-col">
        <LetterResult result={result} method={method} />
      </div>
    </div>
  );
}
