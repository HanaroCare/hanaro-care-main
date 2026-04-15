/**
 * 숫자를 한글 통화 형식으로 변환합니다. (예: 920,000,000 -> 9억 2,000만)
 */
export function formatKoreanCurrency(amount: number): string {
  if (amount === 0) return '0원';

  const units = [
    { value: 100_000_000, label: '억' },
    { value: 10_000, label: '만' },
  ];

  let result = '';
  let remaining = amount;

  for (const unit of units) {
    const quotient = Math.floor(remaining / unit.value);
    if (quotient > 0) {
      const formattedQuotient = quotient.toLocaleString();
      result += `${formattedQuotient}${unit.label} `;
      remaining %= unit.value;
    }
  }

  // 남은 금액이 있고 결과가 비어있는 경우 (만 원 미만)
  if (remaining > 0 || result === '') {
    // 만약 억/만 단위가 이미 있다면 공백 뒤에 추가, 아니면 그냥 추가
    const formattedRemaining = remaining.toLocaleString();
    if (formattedRemaining !== '0') {
      result += formattedRemaining;
    }
  }

  return `${result.trim()}원`;
}
