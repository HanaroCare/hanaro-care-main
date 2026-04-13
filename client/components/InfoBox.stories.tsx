import type { Meta, StoryObj } from '@storybook/react';
import InfoBox from './InfoBox';

const meta: Meta<typeof InfoBox> = {
  title: 'Components/Common/InfoBox',
  component: InfoBox,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: '박스의 제목' },
    desc: { control: 'text', description: '박스의 상세 설명' },
    className: { control: 'text', description: '추가 스타일 클래스' },
  },
};

export default meta;
type Story = StoryObj<typeof InfoBox>;

// 1. 기본형: 유언대용신탁 안내
export const Default: Story = {
  args: {
    title: '유언대용신탁이란?',
    desc: '고객님이 생전에는 자산을 직접 관리하고, 사후에는 미리 정한 수익자에게 자산을 안전하게 전달하는 서비스입니다.',
  },
};

// 2. 응용형: 주의사항 안내
export const Warning: Story = {
  args: {
    title: '꼭 확인하세요!',
    desc: '본 시뮬레이션 결과는 입력하신 데이터를 바탕으로 산출되었으며, 실제 상속 시점의 법령에 따라 달라질 수 있습니다.',
  },
};

// 3. 여백 테스트용
export const WithMargin: Story = {
  args: {
    title: '하나 케어 혜택',
    desc: '지금 바로 전문 세무사와의 1:1 상담을 예약하고 상속 세액을 절감해보세요.',
    className: 'mt-10 mb-10',
  },
};
