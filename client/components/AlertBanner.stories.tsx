import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BellRing, CheckCircle2 } from "lucide-react";
import { AlertBanner } from "./AlertBanner";

const meta = {
	title: "Common/AlertBanner",
	component: AlertBanner,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: `
Hana Care 서비스 내에서 중요한 공지나 상태 정보를 전달하는 배너입니다.

주로 자산 탭 상단이나 시뮬레이션 결과 화면에서 **사용자의 주의를 환기하거나 추가 행동(인증, 확인 등)을 유도**할 때 사용됩니다.

## Variants
- **warning** (기본): 주의가 필요한 상태. (예: 보험 인증 필요)
- **info**: 일반적인 정보 제공. (예: 주택연금 수령 안내)
- **success**: 긍정적인 변화나 완료 상태. (예: 병원비 절감 확인)

## Interaction
- \`actionText\`가 있을 경우 우측에 이동 버튼이 나타납니다.
- 클릭 시 \`onActionAction\` 함수가 실행됩니다.
        `,
			},
		},
	},
	args: {
		message: "보험대리청구인으로 지정되셨나요?",
		variant: "warning",
	},
	argTypes: {
		variant: {
			control: "inline-radio",
			options: ["warning", "info", "success"],
			description: "배너의 테마와 색상을 결정합니다.",
			table: {
				type: { summary: `'warning' | 'info' | 'success'` },
				defaultValue: { summary: "warning" },
			},
		},
		message: {
			description: "배너에 표시될 핵심 메시지입니다.",
			table: { type: { summary: "string" } },
		},
		actionText: {
			description: "우측에 표시될 버튼 텍스트입니다.",
			table: { type: { summary: "string" } },
		},
		onActionAction: {
			action: "clicked",
			description: "우측 버튼 클릭 시 호출되는 핸들러입니다.",
			table: { type: { summary: "() => void" } },
		},
		icon: {
			control: false,
			description: "좌측에 표시될 커스텀 아이콘입니다.",
		},
	},
} satisfies Meta<typeof AlertBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Warning: Story = {
	args: {
		variant: "warning",
		actionText: "인증하기",
		message: "보험대리청구인 지정이 필요합니다.",
	},
};

export const Info: Story = {
	args: {
		variant: "info",
		message: "주택연금 예상 수령액이 업데이트되었습니다.",
		icon: <BellRing size={22} />,
	},
};

export const Success: Story = {
	args: {
		variant: "success",
		actionText: "확인하기",
		message: "자산 포트폴리오 최적화가 완료되었습니다.",
		icon: <CheckCircle2 size={22} />,
	},
};
