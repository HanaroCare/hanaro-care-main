export function formatKoreanCurrencyShort(amount: number): string {
  if (!amount) return '0원';

  const isNegative = amount < 0;
  const abs = Math.abs(amount);

  const eok = Math.floor(abs / 100_000_000);
  const cheonMan = Math.floor((abs % 100_000_000) / 10_000_000);

  let result = '';
  if (eok > 0) result += `${eok}억`;
  if (cheonMan > 0) result += ` ${cheonMan}천만`;

  if (!result) {
    const man = Math.floor(abs / 10_000);
    result = man > 0 ? `${man}만` : '0';
  }

  return `${isNegative ? '-' : ''}${result.trim()}원`;
}

export function formatKoreanCurrency(amount: number): string {
  if (!amount) return '0원';

  const isNegative = amount < 0;
  let remaining = Math.abs(amount);

  const units = [
    { value: 100_000_000, label: '억' },
    { value: 10_000, label: '만' },
  ];

  let result = '';

  for (const unit of units) {
    const quotient = Math.floor(remaining / unit.value);
    if (quotient > 0) {
      result += `${quotient.toLocaleString()}${unit.label} `;
      remaining %= unit.value;
    }
  }

  return `${isNegative ? '-' : ''}${result.trim()}원`;
}
