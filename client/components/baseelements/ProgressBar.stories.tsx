import type { Meta, StoryObj } from '@storybook/react';
import ProgressBar from '@/components/baseelements/ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Base/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  argTypes: {
    step: { control: { type: 'number', min: 0 } },
    total: { control: { type: 'number', min: 1 } },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

// 1. 시작 (1/6)
export const Step1: Story = {
  args: {
    step: 1,
    total: 6,
  },
};

// 2. 중간 단계 (3/6)
export const Step3: Story = {
  args: {
    step: 3,
    total: 6,
  },
};

// 3. 마지막 단계 (6/6)
export const LastStep: Story = {
  args: {
    step: 6,
    total: 6,
  },
};

// 4. total을 다르게 지정 (2/4)
export const CustomTotal: Story = {
  args: {
    step: 2,
    total: 4,
  },
};
