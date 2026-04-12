import Link from 'next/link';
import { Route } from 'next';
import { ChevronRight } from 'lucide-react';

interface MenuItemProps {
  bgColor: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href: Route;
}

export default function MenuItem({ bgColor, icon, title, subtitle, href }: MenuItemProps) {
  return (
    <Link href={href} className="flex items-center w-full">
      {/* 아이콘 배경 */}
      <div
        className="flex items-center justify-center rounded-xl shrink-0"
        style={{ width: '49px', height: '48px', backgroundColor: bgColor }}
      >
        {icon}
      </div>

      {/* 텍스트 */}
      <div className="flex flex-col ml-4 flex-1">
        <span className="font-medium text-[18px] leading-[22px] text-[#1A212D]">{title}</span>
        <span className="font-normal text-[12px] leading-[18px] text-[#535C6A] mt-1">{subtitle}</span>
      </div>

      {/* 화살표 */}
      <ChevronRight size={20} color="#E5E5E5" strokeWidth={2} />
    </Link>
  );
}