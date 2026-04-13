import type { Meta, StoryObj } from '@storybook/react';
import PageDescription from './PageDescription';

const meta: Meta<typeof PageDescription> = {
  title: 'Typography/PageDescription',
  component: PageDescription,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PageDescription>;

export const Default: Story = {
  args: {
    children:
      '아래 데이터를 자동으로 분석해서\n노후 자금이 얼마나 필요한지 계산해드려요',
  },
};
