import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import PrimaryButton from '../baseelements/PrimaryButton';
import BottomSheet from './BottomSheet';

const meta: Meta<typeof BottomSheet> = {
  title: 'Modules/BottomSheet',
  component: BottomSheet,
  tags: ['autodocs'],
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      // 1. h-[300px] 대신 권장되는 h-75로 수정
      <div className="flex h-75 items-center justify-center bg-gray-50">
        <PrimaryButton
          label="바텀시트 열기"
          onClick={() => setIsOpen(true)}
          fullWidth={false}
          className="px-6"
        />
        <BottomSheet {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-lg">하나 케어 안내</h3>
            <p className="text-gray-600 text-sm">
              이곳에 원하는 내용을 담을 수 있습니다. <br />
              스크롤이 길어지면 자동으로 내부 스크롤이 생성됩니다.
            </p>
            <PrimaryButton
              label="확인했습니다"
              onClick={() => setIsOpen(false)}
            />
          </div>
        </BottomSheet>
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof BottomSheet>;

export const Default: Story = {
  args: {
    isOpen: true,
  },
};

export const LongContent: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      // 2. h-[300px] 대신 h-75로 수정
      <div className="flex h-75 items-center justify-center">
        <PrimaryButton label="긴 시트 열기" onClick={() => setIsOpen(true)} />
        <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="flex flex-col gap-6 py-4">
            <h3 className="font-bold text-xl">이용약관 상세</h3>
            {/* 3. index 대신 고유한 값을 key로 사용 (noArrayIndexKey 해결) */}
            {Array.from({ length: 10 }).map((_, i) => (
              <p key={`term-paragraph-${i + 1}`} className="text-gray-500">
                제 {i + 1}조: 이 서비스는 하나로 연결되는 실버 케어
                플랫폼입니다...
              </p>
            ))}
          </div>
        </BottomSheet>
      </div>
    );
  },
};
