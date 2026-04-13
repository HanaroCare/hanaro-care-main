import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NavigationBar } from './NavigationBar';

const meta = {
  title: 'Navigation/NavigationBar',
  component: NavigationBar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Hana Care 서비스의 최하단 전역 네비게이션 바입니다.

## Interaction
- 각 아이템 클릭 시 \`router.push(href)\`가 실행됩니다.
- 스토리북의 **Actions** 패널에서 이동하려는 URI 로그를 확인할 수 있습니다.
        `,
      },
    },
  },
} satisfies Meta<typeof NavigationBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/', // 초기 경로 설정
      },
    },
  },
};

export const AssetSelected: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/asset', // 자산 설계 탭 활성화 상태 예시
      },
    },
  },
};
