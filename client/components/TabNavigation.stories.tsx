import type { Meta, StoryObj } from '@storybook/react';
import type React from 'react';
import { useState } from 'react';
import { TabNavigation } from './TabNavigation';

type TabNavigationProps = React.ComponentProps<typeof TabNavigation>;

const meta = {
  title: 'Simulator/TabNavigation',
  component: TabNavigation,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  // 1. 전역 args에서 함수의 타입을 명확히 정의합니다.
  args: {
    activeTab: 'asset',
    onTabChange: (tabId: string) => {}, // 인자 타입을 명시하여 충돌 방지
  },
} satisfies Meta<typeof TabNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveRender = (args: TabNavigationProps) => {
  const [activeTab, setActiveTab] = useState(args.activeTab);

  return (
    <TabNavigation
      {...args}
      activeTab={activeTab}
      onTabChange={(id: string) => {
        setActiveTab(id);
        // args.onTabChange가 존재할 때만 실행
        args.onTabChange?.(id);
      }}
    />
  );
};

export const DualTabs: Story = {
  render: (args) => <InteractiveRender {...args} />,
  args: {
    tabs: [
      { id: 'asset', label: '자산' },
      { id: 'inheritance', label: '상속' },
    ],
    activeTab: 'asset',
  },
};

export const MultipleTabs: Story = {
  render: (args) => (
    <div className="min-h-[200px] bg-hana-silver-50">
      <InteractiveRender {...args} />
      <div className="p-10 text-center font-medium text-hana-black-500">
        하나은행 자산 관리 카테고리
      </div>
    </div>
  ),
  args: {
    tabs: [
      { id: 'asset', label: '자산' },
      { id: 'realestate', label: '부동산' },
      { id: 'insurance', label: '보험' },
      { id: 'car', label: '자동차' },
      { id: 'gold', label: '금' },
    ],
    activeTab: 'asset',
  },
};

export const LongTextTabs: Story = {
  args: {
    tabs: [
      { id: '1', label: '정기예금/적금' },
      { id: '2', label: '투자성 금융상품' },
      { id: '3', label: '기타 자산' },
    ],
    activeTab: '1',
  },
};
