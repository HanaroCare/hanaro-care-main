import type { Meta, StoryObj } from '@storybook/react';
import PrimaryButton from './PrimaryButton';

const meta: Meta<typeof PrimaryButton> = {
  title: 'Components/Common/PrimaryButton',
  component: PrimaryButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'disabled'],
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof PrimaryButton>;

// 1. 기본 강조 버튼 (Primary)
export const Primary: Story = {
  args: {
    label: '확인',
    variant: 'primary',
    fullWidth: true,
  },
};

// 2. 보조 버튼 (Secondary)
export const Secondary: Story = {
  args: {
    label: '이전으로',
    variant: 'secondary',
    fullWidth: true,
  },
};

// 3. 비활성화 상태 (Disabled)
export const Disabled: Story = {
  args: {
    label: '입력해주세요',
    disabled: true,
    fullWidth: true,
  },
};

// 4. 가로 꽉 채우지 않는 버튼
export const Small: Story = {
  args: {
    label: '작은 버튼',
    variant: 'primary',
    fullWidth: false,
    className: 'px-6', // 너비가 없을 때를 대비해 여백 추가
  },
};
