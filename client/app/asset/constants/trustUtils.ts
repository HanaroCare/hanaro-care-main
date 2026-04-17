export function parseKoreanAmount(amount: string): number {
  const normalized = amount.replace(/\s|,/g, '');
  let total = 0;

  const eok = normalized.match(/(\d+(?:\.\d+)?)억/)?.[1];
  const cheonMan = normalized.match(/(\d+)천만/)?.[1];
  const man = normalized.match(/(\d+)만(?:원)?/)?.[1];

  if (eok) total += Number(eok) * 100_000_000;
  if (cheonMan) total += Number(cheonMan) * 10_000_000;
  if (man && !cheonMan) total += Number(man) * 10_000;

  if (total === 0) {
    const onlyDigits = normalized.replace(/[^\d]/g, '');
    return Number(onlyDigits || 0) * 10_000;
  }
  return Math.round(total);
}
export function formatKoreanAmount(num: number): string {
  const eok = Math.floor(num / 100_000_000);
  const man = Math.floor((num % 100_000_000) / 10_000);

  if (eok > 0 && man > 0) return `${eok}억 ${man.toLocaleString()}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${man.toLocaleString()}만원`;
}

export const handleReservation = () => {
  window.location.href =
    'https://m.hanabank.com/m/oqs/livingCounsel.do?coopChnl=0003';
};
