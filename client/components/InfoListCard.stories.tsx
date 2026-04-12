import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InfoListCard } from "./InfoListCard";

const meta = {
	title: "Common/InfoListCard",
	component: InfoListCard,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: `
부동산, 자동차, 금 등 자산의 **상세 데이터(취득 정보, 대출 정보 등)**를 깔끔한 리스트 형태로 나열하는 카드입니다.

복잡한 금융 수치나 정보를 사용자가 한눈에 읽기 편하도록 라벨과 데이터로 나누어 제공합니다.

## Interaction
- 컴포넌트 렌더링 시 위로 부드럽게 솟아오르는 페이드 인 애니메이션이 적용됩니다.
        `,
			},
		},
	},
	args: {
		title: "취득 정보",
		items: [
			{ label: "취득일", value: "2018.05.20" },
			{ label: "취득가", value: "7억 5,000만원" },
		],
	},
	argTypes: {
		title: {
			description: "카드의 상단 제목입니다.",
			table: { type: { summary: "string" } },
		},
		items: {
			description: "표시될 상세 정보 항목들의 배열입니다.",
			table: {
				type: { summary: "InfoItem[]" },
			},
		},
	},
} satisfies Meta<typeof InfoListCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PropertyInfo: Story = {
	args: {
		title: "부동산 상세 정보",
		items: [
			{ label: "소재지", value: "서울 강남구 역삼동 아파트" },
			{ label: "전용면적", value: "84㎡ (33평)" },
			{ label: "KB시세", value: "9억 2,000만원" },
		],
	},
};

export const LoanInfo: Story = {
	args: {
		title: "담보 대출 현황",
		items: [
			{ label: "대출 잔액", value: "2억 1,000만원" },
			{ label: "적용 금리", value: "연 3.8%" },
			{ label: "만기일자", value: "2034.03.15" },
		],
	},
};
