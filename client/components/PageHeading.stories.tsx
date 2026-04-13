import type { Meta, StoryObj } from '@storybook/react';
import PageHeading from './PageHeading';

const meta: Meta<typeof PageHeading> = {
  title: 'Components/Typography/PageHeading',
  component: PageHeading,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PageHeading>;

export const Default: Story = {
  args: {
    children: '내 자산으로\n병원비 요양비 걱정 없이\n살 수 있는지 알아봐요',
  },
};

export const WithHighlight: Story = {
  args: {
    children: (
      <>
        내 자산으로{'\n'}
        <span className="text-primary">병원비 요양비</span> 걱정 없이{'\n'}살 수
        있는지 알아봐요
      </>
    ),
  },
};
