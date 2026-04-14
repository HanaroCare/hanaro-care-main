import type { Meta, StoryObj } from '@storybook/react';
import { StepIndicator } from './StepIndicator';

const meta: Meta<typeof StepIndicator> = {
  title: 'Base/StepIndicator',
  component: StepIndicator,
  tags: ['autodocs'],
  argTypes: {
    totalSteps: { control: { type: 'number', min: 1, max: 10 } },
    currentStep: { control: { type: 'number', min: 0 } },
    idPrefix: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof StepIndicator>;

// 1. 기본 상태 (3단계 중 첫 번째)
export const Default: Story = {
  args: {
    totalSteps: 3,
    currentStep: 0,
    idPrefix: 'onboarding',
  },
};

// 2. 진행 중 상태
export const InProgress: Story = {
  args: {
    totalSteps: 5,
    currentStep: 2,
    idPrefix: 'signup',
  },
};

// 3. 마지막 단계
export const LastStep: Story = {
  args: {
    totalSteps: 4,
    currentStep: 3,
    idPrefix: 'auth',
  },
};
