type Props = {
	children: React.ReactNode;
	className?: string;
};

export default function SectionCard({ children, className = "" }: Props) {
	return (
		<div
			className={`
				rounded-[24px] bg-white border border-[#E5E7EB]
				p-6
				${className}
			`}
		>
			{children}
		</div>
	);
}
