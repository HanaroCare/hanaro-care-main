export function parseKoreanAmount(amount: string): number {
	const clean = amount.replace(/[^\d]/g, "");
	const num = parseInt(clean || "0", 10);
	if (amount.includes("억")) return num * 100_000_000;
	return num * 10_000;
}
export function formatKoreanAmount(num: number): string {
	const eok = Math.floor(num / 100_000_000);
	const man = Math.floor((num % 100_000_000) / 10_000);

	if (eok > 0 && man > 0) return `${eok}억 ${man.toLocaleString()}만원`;
	if (eok > 0) return `${eok}억원`;
	return `${man.toLocaleString()}만원`;
}
