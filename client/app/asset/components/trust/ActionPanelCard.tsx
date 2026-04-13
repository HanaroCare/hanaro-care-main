type ActionPanelCardProps = {
	onChangeLivingLimit?: () => void;
	onChangePermission?: () => void;
	onBookConsult?: () => void;
};

export function ActionPanelCard({
	onChangeLivingLimit,
	onChangePermission,
	onBookConsult,
}: ActionPanelCardProps) {
	return (
		<div className="rounded-2xl bg-gradient-to-br from-hana-teal-300 to-hana-teal-700 p-5 text-white">
			<div className="space-y-3 text-sm">
				<div className="flex justify-between">
					<span>생활비 한도</span>
					<button type="button" onClick={onChangeLivingLimit}>
						월 100만원 변경 &gt;
					</button>
				</div>

				<div className="flex justify-between">
					<span>집행 내역 열람</span>
					<button type="button" onClick={onChangePermission}>
						권한 변경 &gt;
					</button>
				</div>

				<div className="flex justify-between">
					<span>운용 방식</span>
					<button type="button" onClick={onBookConsult}>
						상담 예약 &gt;
					</button>
				</div>
			</div>
		</div>
	);
}
