import type { Meta, StoryObj } from "@storybook/react";
import ShareSheet from "./ShareSheet";

/**
 * ShareSheet 컴포넌트는 공유 옵션(카카오톡, 문자)과 링크 복사 기능을 제공하는 바텀 시트입니다.
 */
const meta: Meta<typeof ShareSheet> = {
  title: "Modules/ShareSheet",
  component: ShareSheet,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      description: "바텀 시트 상단에 표시될 제목입니다.",
      control: "text",
    },
    shareUrl: {
      description: "공유될 URL입니다. 입력하지 않으면 현재 브라우저 URL이 사용됩니다.",
      control: "text",
    },
    onClose: {
      description: "시트를 닫을 때 호출되는 함수입니다.",
      action: "closed",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ShareSheet>;

/**
 * 기본 가족 추가하기 스타일입니다.
 */
export const FamilyAdd: Story = {
  args: {
    title: "가족 추가하기",
    shareUrl: "https://hanaro-care.com/my/family/add",
  },
};

/**
 * 카드 증빙 요청 시 사용되는 스타일입니다.
 */
export const EvidenceRequest: Story = {
  args: {
    title: "증빙 요청 보내기",
    shareUrl: "https://hanaro-care.com/card/usage/123",
  },
};
