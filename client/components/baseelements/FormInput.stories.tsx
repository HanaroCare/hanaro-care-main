import type { Meta, StoryObj } from '@storybook/react';
import FormInput from './FormInput';

const meta: Meta<typeof FormInput> = {
  title: 'Base/FormInput',
  component: FormInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'number', 'password'],
    },
    onChange: { action: 'changed' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '375px', padding: '20px', backgroundColor: '#fff' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FormInput>;

export const Default: Story = {
  args: {
    label: '주소',
    id: 'address',
    placeholder: '성동로 124길',
    value: '',
  },
};

export const WithValue: Story = {
  args: {
    label: '면적 (m²)',
    id: 'area',
    value: '84',
  },
};

/** * global Error와 이름이 겹치지 않도록 ErrorState로 변경했습니다.
 */
export const ErrorState: Story = {
  args: {
    label: '취득연도',
    id: 'year',
    value: '2026',
    error: '미래 년도는 입력할 수 없어요.',
  },
};

export const WithSuffix: Story = {
  args: {
    label: '주소',
    id: 'address-search',
    placeholder: '성동로 124길',
    value: '',
    suffix: (
      <button
        type="button"
        className="h-14 shrink-0 rounded-[10px] border border-border-gray px-4 font-medium text-[15px] text-hana-black-600 active:bg-gray-50"
      >
        주소 검색
      </button>
    ),
  },
};

export const NumberInput: Story = {
  args: {
    label: '금액',
    id: 'amount',
    type: 'number',
    placeholder: '숫자만 입력',
    value: '',
  },
};
