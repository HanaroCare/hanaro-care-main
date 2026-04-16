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

  // 만원 미만 처리
  if (remaining > 0) {
    result += remaining.toLocaleString();
  }

  return `${isNegative ? '-' : ''}${result.trim()}원`;
}
