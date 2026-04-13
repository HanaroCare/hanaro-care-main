import type { Meta, StoryObj } from '@storybook/react';
import DualActionFooter from './DualActionFooter';

const meta: Meta<typeof DualActionFooter> = {
  title: 'Components/Common/DualActionFooter',
  component: DualActionFooter,
  tags: ['autodocs'],
  argTypes: {
    onLeftClick: { action: 'left-clicked' },
    onRightClick: { action: 'right-clicked' },
  },
  // 푸터이므로 화면 하단에 붙어있는 느낌을 주기 위해 배경을 살짝 잡아줍니다.
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof DualActionFooter>;

// 1. 기본 상태 (이전 / 다음)
export const Default: Story = {
  args: {
    leftLabel: '이전',
    rightLabel: '다음',
  },
};

// 2. 우측 버튼 비활성화 (약관 동의 전 등)
export const RightDisabled: Story = {
  args: {
    leftLabel: '취소',
    rightLabel: '확인',
    rightDisabled: true,
  },
};

// 3. 버튼 클릭 함수가 없을 때 (자동 비활성화 테스트)
export const NoFunctions: Story = {
  args: {
    leftLabel: '작동불가',
    rightLabel: '작동불가',
  },
};

// 4. 긴 라벨 텍스트 테스트
export const LongLabels: Story = {
  args: {
    leftLabel: '아니오, 돌아갈래요',
    rightLabel: '네, 동의하고 진행합니다',
  },
};
