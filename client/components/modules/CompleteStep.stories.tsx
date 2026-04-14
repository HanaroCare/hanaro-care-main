import type { Meta, StoryObj } from '@storybook/react';
import { Star } from 'lucide-react';
import PrimaryButton from '../baseelements/PrimaryButton';
import CompleteStep from './CompleteStep';

const meta: Meta<typeof CompleteStep> = {
  title: 'Modules/CompleteStep',
  component: CompleteStep,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof CompleteStep>;

// 1. 기본 상태 — 타이틀 + 설명 + 버튼 1개
export const Default: Story = {
  args: {
    footer: <PrimaryButton label="홈으로 돌아가기" onClick={() => {}} className="h-14 rounded-2xl" />,
    children: (
      <>
        <h2 className="text-[1.75rem] font-bold leading-tight tracking-tight text-gray-900">
          신청이 완료되었어요
        </h2>
        <p className="mt-4 whitespace-pre-line text-[1.125rem] leading-relaxed text-gray-500">
          {'영업일 기준 3일 이내에\n처리 결과를 알려드릴게요.'}
        </p>
      </>
    ),
  },
};

// 2. 버튼 2개
export const WithSecondaryButton: Story = {
  args: {
    footer: (
      <>
        <PrimaryButton label="설계 내역 보기" variant="secondary" onClick={() => {}} className="h-14 rounded-2xl" />
        <PrimaryButton label="홈으로" onClick={() => {}} className="h-14 rounded-2xl" />
      </>
    ),
    children: (
      <>
        <h2 className="text-[1.75rem] font-bold leading-tight tracking-tight text-gray-900">
          가입이 완료되었어요
        </h2>
        <p className="mt-4 whitespace-pre-line text-[1.125rem] leading-relaxed text-gray-500">
          {'내맘대로신탁 설계 내역을\n지금 바로 확인해보세요.'}
        </p>
      </>
    ),
  },
};

// 3. 요약 카드 포함
export const WithSummaryCard: Story = {
  args: {
    footer: <PrimaryButton label="확인" onClick={() => {}} className="h-14 rounded-2xl" />,
    children: (
      <>
        <h2 className="text-[1.75rem] font-bold leading-tight tracking-tight text-gray-900">
          상담이 예약되었어요
        </h2>
        <p className="mt-4 text-[1.125rem] leading-relaxed text-gray-500">
          예약 정보를 확인해주세요.
        </p>
        <div className="mt-8 w-full rounded-3xl bg-[#F4F6F8] px-6 py-5 text-left">
          <div className="flex flex-col gap-3">
            {[
              { label: '예약 일시', value: '2026.04.15 오전 10:00' },
              { label: '지점', value: '하나은행 강남지점' },
              { label: '담당자', value: '김하나 행원' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-semibold text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </>
    ),
  },
};

// 4. 커스텀 아이콘
export const CustomIcon: Story = {
  args: {
    icon: <Star className="h-[4.5rem] w-[4.5rem] text-hana-ez-600" fill="currentColor" />,
    footer: <PrimaryButton label="목록 보기" onClick={() => {}} className="h-14 rounded-2xl" />,
    children: (
      <h2 className="text-[1.75rem] font-bold leading-tight tracking-tight text-gray-900">
        찜 목록에 추가됐어요
      </h2>
    ),
  },
};
