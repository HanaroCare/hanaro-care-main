import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Header from './Header';

const meta = {
  title: 'Common/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Hana Care 서비스의 전역 공통 헤더 컴포넌트입니다.

페이지의 제목을 표시하고, 뒤로가기(\`ChevronLeft\`) 또는 닫기(\`X\`) 버튼을 통해 페이지 흐름을 제어합니다.

## 주요 기능
- **Sticky 고정**: \`sticky top-0\` 설정으로 스크롤 시에도 상단에 고정됩니다.
- **자동 라우팅**: \`onBack\`이나 \`onClose\`를 별도로 넘기지 않으면 \`router.back()\`이 기본 실행됩니다.
- **중앙 정렬 보장**: 양옆 버튼 영역의 너비를 \`w-8\`로 고정하여 제목이 항상 화면의 수평 중앙에 위치합니다.
        `,
      },
    },
  },
  // 기본 props 설정
  args: {
    title: '페이지 제목',
    showBackButton: true,
    showCloseButton: false,
  },
  argTypes: {
    title: {
      description: '헤더 중앙에 표시될 제목입니다.',
      table: {
        type: { summary: 'string' },
      },
    },
    showBackButton: {
      control: 'boolean',
      description: '뒤로가기 버튼 표시 여부를 결정합니다.',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    showCloseButton: {
      control: 'boolean',
      description: '닫기 버튼 표시 여부를 결정합니다.',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    onBack: {
      action: 'back clicked',
      description: '뒤로가기 버튼 클릭 시 실행될 커스텀 함수입니다.',
    },
    onClose: {
      action: 'close clicked',
      description: '닫기 버튼 클릭 시 실행될 커스텀 함수입니다.',
    },
    className: {
      description: '헤더에 추가할 커스텀 스타일 클래스입니다.',
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 가장 기본적인 상세 페이지 헤더 형태입니다.
 */
export const Default: Story = {
  args: {
    title: '자산 상세 정보',
  },
};

/**
 * 제목만 있고 버튼이 없는 형태입니다. (메인 화면 등)
 */
export const TitleOnly: Story = {
  args: {
    title: 'Hana Care',
    showBackButton: false,
  },
};

/**
 * 폼 입력이나 모달 성격의 페이지에서 사용되는 닫기 버튼 포함 형태입니다.
 */
export const WithCloseButton: Story = {
  args: {
    title: '정보 입력',
    showBackButton: false,
    showCloseButton: true,
  },
};

/**
 * 양쪽에 버튼이 모두 있는 복나한 형태입니다.
 */
export const BothButtons: Story = {
  args: {
    title: '시뮬레이션 설정',
    showBackButton: true,
    showCloseButton: true,
  },
};

/**
 * 배경색을 커스텀하거나 투명하게 만들 때 사용 예시입니다.
 */
export const CustomStyle: Story = {
  args: {
    title: '커스텀 헤더',
    className: 'bg-hana-green-50 border-hana-green-100',
  },
};
