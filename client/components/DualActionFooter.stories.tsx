import type { Meta, StoryObj } from '@storybook/react';
import DualActionFooter from './DualActionFooter';

const meta: Meta<typeof DualActionFooter> = {
  title: 'Components/DualActionFooter',
  component: DualActionFooter,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    leftLabel: { control: 'text' },
    rightLabel: { control: 'text' },
    leftDisabled: { control: 'boolean' },
    rightDisabled: { control: 'boolean' },
    onLeftClick: { action: 'left clicked' },
    onRightClick: { action: 'right clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof DualActionFooter>;

export const Default: Story = {
  args: {
    leftLabel: '이전',
    rightLabel: '다음',
    onLeftClick: () => {},
    onRightClick: () => {},
  },
};

export const CancelAndConfirm: Story = {
  args: {
    leftLabel: '취소',
    rightLabel: '확인',
    onLeftClick: () => {},
    onRightClick: () => {},
  },
};

export const LeftDisabled: Story = {
  args: {
    leftLabel: '이전',
    rightLabel: '다음',
    leftDisabled: true,
    onLeftClick: () => {},
    onRightClick: () => {},
  },
};

export const RightDisabled: Story = {
  args: {
    leftLabel: '취소',
    rightLabel: '신청하기',
    rightDisabled: true,
    onLeftClick: () => {},
    onRightClick: () => {},
  },
};

export const BothDisabled: Story = {
  args: {
    leftLabel: '이전',
    rightLabel: '다음',
    leftDisabled: true,
    rightDisabled: true,
    onLeftClick: () => {},
    onRightClick: () => {},
  },
};

export const NoHandlers: Story = {
  args: {
    leftLabel: '취소',
    rightLabel: '확인',
    // onLeftClick, onRightClick 미전달 → 버튼 자동 비활성화
  },
};

export const LoanApply: Story = {
  args: {
    leftLabel: '취소',
    rightLabel: '대출 신청',
    onLeftClick: () => {},
    onRightClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: '대출 신청 화면에서 사용하는 예시입니다.',
      },
    },
  },
};
