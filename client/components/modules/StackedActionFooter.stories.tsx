import type { Meta, StoryObj } from '@storybook/react';
import StackedActionFooter from './StackedActionFooter';

const meta: Meta<typeof StackedActionFooter> = {
  title: 'Modules/StackedActionFooter',
  component: StackedActionFooter,
  tags: ['autodocs'],
  argTypes: {
    onConsultClick: { action: 'consult-clicked' },
    onNextClick: { action: 'next-clicked' },
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof StackedActionFooter>;

// 1. 기본 상태
export const Default: Story = {
  args: {
    consultLabel: '상담 예약하기',
    nextLabel: '다음으로',
  },
};

// 2. 상담 버튼 비활성화
export const ConsultDisabled: Story = {
  args: {
    consultLabel: '상담 예약하기',
    nextLabel: '다음으로',
    consultDisabled: true,
  },
};

// 3. 다음 버튼 비활성화 (항목 미선택 등)
export const NextDisabled: Story = {
  args: {
    consultLabel: '상담 예약하기',
    nextLabel: '다음으로',
    nextDisabled: true,
  },
};

// 4. 두 버튼 모두 비활성화
export const AllDisabled: Story = {
  args: {
    consultLabel: '상담 예약하기',
    nextLabel: '다음으로',
    consultDisabled: true,
    nextDisabled: true,
  },
};

// 5. 커스텀 라벨
export const CustomLabels: Story = {
  args: {
    consultLabel: '지점 방문 예약',
    nextLabel: '결과 보기',
  },
};
