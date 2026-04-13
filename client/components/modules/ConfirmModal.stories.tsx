import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import PrimaryButton from '../baseelements/PrimaryButton';
import ConfirmModal from './ConfirmModal';

const meta: Meta<typeof ConfirmModal> = {
  title: 'Modules/ConfirmModal',
  component: ConfirmModal,
  tags: ['autodocs'],
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="flex h-75 items-center justify-center bg-gray-50">
        <PrimaryButton
          label="모달 열기"
          onClick={() => setIsOpen(true)}
          fullWidth={false}
          className="px-6"
        />
        <ConfirmModal
          {...args}
          isOpen={isOpen}
          onCancel={() => setIsOpen(false)}
          onConfirm={() => setIsOpen(false)}
        />
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmModal>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: '정말 진행하시겠습니까?',
    cancelLabel: '닫기',
    confirmLabel: '확인',
  },
};

export const CustomLabels: Story = {
  args: {
    isOpen: true,
    title: '대출 신청을 취소하시겠습니까?',
    cancelLabel: '돌아가기',
    confirmLabel: '취소하기',
  },
};

export const MultiLineTitle: Story = {
  args: {
    isOpen: true,
    title: (
      <>
        제출 후에는 수정이 불가합니다.
        <br />
        신청하시겠습니까?
      </>
    ),
  },
};

export const DestructiveConfirm: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    return (
      <div className="flex h-75 flex-col items-center justify-center gap-4 bg-gray-50">
        <PrimaryButton
          label="탈퇴 모달 열기"
          onClick={() => {
            setIsOpen(true);
            setResult(null);
          }}
          fullWidth={false}
          className="px-6"
        />
        {result && <p className="text-sm text-gray-500">{result}</p>}
        <ConfirmModal
          isOpen={isOpen}
          title={
            <>
              정말 탈퇴하시겠습니까?
              <br />
              탈퇴 시 모든 정보가 삭제됩니다.
            </>
          }
          cancelLabel="취소"
          confirmLabel="탈퇴하기"
          onCancel={() => {
            setIsOpen(false);
            setResult('취소했습니다.');
          }}
          onConfirm={() => {
            setIsOpen(false);
            setResult('탈퇴 처리됐습니다.');
          }}
        />
      </div>
    );
  },
};
