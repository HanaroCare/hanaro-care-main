export function ActionPanelCard() {
	return (
		<div className="rounded-2xl bg-gradient-to-br from-hana-teal-600 to-hana-teal-300 p-5 text-white">
			<div className="space-y-3 text-sm">
				<Row title="생활비 한도" action="월 100만원 변경 >" />
				<Row title="집행 내역 열람" action="권한 변경 >" />
				<Row title="운용 방식" action="상담 예약 >" />
			</div>
		</div>
	);
}

function Row({ title, action }: any) {
	return (
		<div className="flex justify-between">
			<span>{title}</span>
			<span>{action}</span>
		</div>
	);
}
