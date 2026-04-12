
export async function submitInheritanceLetter({
	recipientId,
	nickname,
	yearsLater,
	method,
	message,
}: {
	recipientId: number;
	nickname: string;
	yearsLater: number | null;
	method: string;
	message: string;
}) {
	// TODO: 백 연결 시 fetch로 교체
	console.log("submitInheritanceLetter", {
		recipientId,
		nickname,
		yearsLater,
		method,
		message,
	});
	await new Promise((resolve) => setTimeout(resolve, 500)); // 로딩 느낌용
}
