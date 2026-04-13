import type { Meta, StoryObj } from '@storybook/react';
import Header from './Header';

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: '헤더 중앙에 표시될 제목',
    },
  },
  args: {
    title: '페이지 제목',
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    title: '페이지 제목',
  },
};

export const LongTitle: Story = {
  args: {
    title: '매우 긴 페이지 제목이 들어갔을 때 어떻게 보이는지 확인',
  },
};

export const ShortTitle: Story = {
  args: {
    title: '홈',
  },
};
