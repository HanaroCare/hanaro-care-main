export const ASSET_DATA = [
  // todo : 실제 값들로 맞추기
  { name: '주식', value: '5억 2,000만', percentage: 74.5, color: '#015E5F' },
  { name: '적금', value: '1억 2,000만', percentage: 63.1, color: '#1EB1B2' },
  { name: '펀드', value: '3,000만', percentage: 50.6, color: '#8DC8C8' },
  { name: '연금', value: '2,000만', percentage: 36.4, color: '#C7E4E4' },
  { name: '계좌', value: '1,000만', percentage: 13.1, color: '#BDAE7F' },
] as const;

export const NAV_ITEMS = [
  { id: 'home', label: '홈', href: '/' },
  { id: 'assets', label: '자산 설계', href: '/asset' },
  { id: 'wallet', label: '돌봄 지갑', href: '/wallet' },
  { id: 'my', label: 'My하나', href: '/my' },
] as const;
