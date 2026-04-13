import type { Meta, StoryObj } from '@storybook/react';
import InfoBox from './InfoBox';

const meta: Meta<typeof InfoBox> = {
  title: 'Components/InfoBox',
  component: InfoBox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    desc: { control: 'text' },
    className: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof InfoBox>;

export const Default: Story = {
  args: {
    title: '안내 제목',
    desc: '여기에 상세 안내 내용이 들어갑니다. 사용자에게 필요한 정보를 친절하게 설명해 주세요.',
  },
};

export const LongDescription: Story = {
  args: {
    title: '개인정보 수집 및 이용 동의',
    desc: '본 서비스 이용을 위해 아래와 같이 개인정보를 수집·이용합니다. 수집 항목: 이름, 생년월일, 연락처. 수집 목적: 본인 확인 및 서비스 제공. 보유 기간: 서비스 이용 종료 후 5년. 동의를 거부할 수 있으며, 거부 시 서비스 이용이 제한될 수 있습니다.',
  },
  parameters: {
    layout: 'padded',
  },
};

export const ShortContent: Story = {
  args: {
    title: '유의사항',
    desc: '1일 1회 신청 가능합니다.',
  },
};

export const WithCustomClass: Story = {
  args: {
    title: '커스텀 스타일 적용',
    desc: 'className prop으로 추가 스타일을 적용한 예시입니다.',
    className: 'w-80',
  },
};

export const MultipleBoxes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <InfoBox
        title="신청 가능 금액"
        desc="최소 10만원 이상, 최대 500만원 이하로 신청 가능합니다."
      />
      <InfoBox
        title="대출 기간"
        desc="최소 6개월부터 최대 60개월까지 선택 가능합니다."
      />
      <InfoBox
        title="금리 안내"
        desc="연 3.5% ~ 15.9% (신용등급에 따라 변동될 수 있습니다)"
      />
    </div>
  ),
};
