import type { Meta, StoryObj } from '@storybook/react';
import PrimaryButton from './PrimaryButton';

const meta: Meta<typeof PrimaryButton> = {
  title: 'Components/PrimaryButton',
  component: PrimaryButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    variant: {
      control: 'radio',
      options: ['primary', 'secondary', 'disabled'],
    },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof PrimaryButton>;

export const Primary: Story = {
  args: {
    label: '확인',
    variant: 'primary',
    disabled: false,
    fullWidth: false,
  },
};

export const Secondary: Story = {
  args: {
    label: '취소',
    variant: 'secondary',
    disabled: false,
    fullWidth: false,
  },
};

export const Disabled: Story = {
  args: {
    label: '비활성화',
    variant: 'primary',
    disabled: true,
    fullWidth: false,
  },
};

export const FullWidth: Story = {
  args: {
    label: '전체 너비 버튼',
    variant: 'primary',
    disabled: false,
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <PrimaryButton label="Primary 버튼" variant="primary" />
      <PrimaryButton label="Secondary 버튼" variant="secondary" />
      <PrimaryButton label="Disabled 버튼" disabled />
    </div>
  ),
};
