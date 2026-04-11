export const formatAmount = (amount: number) => {
	const eok = Math.floor(amount / 100000000);
	const cheon = Math.floor(amount % 100000000)/ 10000000;

	if (cheon === 0) return `${eok}억원`;
	else return `${eok}.${cheon}억원`;
};
