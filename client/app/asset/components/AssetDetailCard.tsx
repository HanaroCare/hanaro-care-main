'use client';
import { Car, ChevronRight, Coins, Home, Shield } from 'lucide-react';
import type { Route } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type InsuranceStatus = 'needs_check' | 'normal';
type IconType = 'hana-bank' | 'nation-pension' | 'default';
type AssetType = 'property' | 'car' | 'gold';

const ICON_MAP: Record<IconType, string> = {
  'hana-bank': '/images/asset/hana-bank.svg',
  'nation-pension': '/images/asset/nation-pension.svg',
  default: '',
};

const ASSET_ICON_MAP = {
  property: { icon: Home, color: 'text-hana-blue-500', bg: 'bg-hana-blue-50' },
  car: { icon: Car, color: 'text-hana-teal-600', bg: 'bg-hana-teal-50' },
  gold: { icon: Coins, color: 'text-hana-gold-500', bg: 'bg-hana-gold-50' },
};

type DetailedAssetCardProps = {
  type: AssetType;
  title: string;
  subtitle: string;
  value: string;
  change?: string;
  changePercent?: string;
  isPositive?: boolean;
  href?: Route<string>;
};

type InsuranceAssetCardProps = {
  type: 'insurance';
  iconType?: IconType;
  company: string;
  insuranceName: string;
  monthlyPremium: string;
  status?: InsuranceStatus;
  href?: Route<string>;
};

type AssetDetailCardProps = DetailedAssetCardProps | InsuranceAssetCardProps;

export function AssetDetailCard(props: AssetDetailCardProps) {
  const router = useRouter();
  const handleCardClick = () => {
    if (props.href) router.push(props.href as Route);
  };

  const cardBaseStyle = "relative flex w-full overflow-hidden rounded-[24px] border-[1px] border-hana-silver-100 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] outline-none transition-all active:scale-[0.98] active:bg-hana-silver-50";

  if (props.type === 'insurance') {
    const {
      iconType = 'hana-bank',
      company,
      insuranceName,
      monthlyPremium,
      status = 'needs_check',
    } = props;

    return (
        <button
            type="button"
            onClick={handleCardClick}
            className={`${cardBaseStyle} h-auto items-center justify-between`}
        >
          <div className="flex items-center gap-4 text-left">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-hana-green-50">
              {iconType === 'default' ? (
                  <Shield size={24} className="text-hana-green-700" />
              ) : (
                  <Image src={ICON_MAP[iconType]} alt="" width={28} height={28} />
              )}
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] font-medium text-hana-black-500 leading-none tracking-tight">
                {company}
              </span>
              <span className="text-[17px] font-bold text-hana-black-900 leading-snug tracking-tight">
                {insuranceName}
              </span>
              <span className="text-[14px] font-semibold text-hana-teal-700 mt-0.5">
                {monthlyPremium} <span className="text-[12px] font-medium text-hana-black-400">/ 월</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <div className={`px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-tighter ${
                status === 'needs_check' ? 'bg-hana-red-50 text-hana-red-500' : 'bg-hana-blue-50 text-hana-blue-500'
            }`}>
              {status === 'needs_check' ? '확인 필요' : '정상'}
            </div>
            {status === 'needs_check' && (
                <div className="flex items-center text-[11px] font-bold text-hana-black-400">
                  보기 <ChevronRight size={12} strokeWidth={3} />
                </div>
            )}
          </div>
        </button>
    );
  }

  const { title, subtitle, value, change, changePercent, isPositive } = props;
  const assetStyle = ASSET_ICON_MAP[props.type as AssetType];
  const AssetIcon = assetStyle.icon;

  return (
      <button
          type="button"
          onClick={handleCardClick}
          className={`${cardBaseStyle} h-auto min-h-[144px] flex-col justify-between items-stretch`}
      >
        <div className="flex w-full items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex size-11 items-center justify-center rounded-2xl ${assetStyle.bg} ${assetStyle.color}`}>
              <AssetIcon size={30} strokeWidth={2} />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[17px] font-bold text-hana-black-900 tracking-tight leading-tight">
                {title}
              </span>
              <span className="text-[12px] font-medium text-hana-black-400">
                {subtitle}
              </span>
            </div>
          </div>
          <div className="text-hana-silver-100">
            <ChevronRight size={22} strokeWidth={2.5} className="text-hana-black-300" />
          </div>
        </div>

        <div className="flex w-full items-end justify-between mt-4">
          <div className="flex flex-col text-left">
            <span className="text-[22px] font-bold text-hana-black-900 tracking-tighter">
              {value}
            </span>
          </div>

          {change && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-[13px] ${
                  isPositive ? 'bg-hana-red-50 text-hana-red-500' : 'bg-hana-blue-50 text-hana-blue-500'
              }`}>
                <span className="text-[11px]">{isPositive ? '▲' : '▼'}</span>
                <span>{change}</span>
                <span className="opacity-70 text-[11px]">({changePercent})</span>
              </div>
          )}
        </div>
      </button>
  );
}