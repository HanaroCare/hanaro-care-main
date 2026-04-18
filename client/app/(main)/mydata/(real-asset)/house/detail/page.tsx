'use client';

import { ChevronDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { getBannerStatus } from '@/app/asset/actions/notificationStatus';
import FormInput from '@/components/baseelements/FormInput';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import ProgressBar from '@/components/baseelements/ProgressBar';
import { AlertBanner } from '@/components/modules/AlertBanner';
import CompleteStep from '@/components/modules/CompleteStep';
import DualActionFooter from '@/components/modules/DualActionFooter';
import PageHeading from '@/components/typography/PageHeading';
import LoadingStep from '../../../components/LoadingStep';
import { linkHousing, type RealAssetLinkResult } from '../../actions/realAsset';

function formatAmtSync(amount: number): string {
  const eok = Math.floor(amount / 100_000_000);
  const man = Math.floor((amount % 100_000_000) / 10_000);
  if (eok > 0 && man > 0) return `${eok}억 ${man.toLocaleString()}만원`;
  if (eok > 0) return `${eok}억`;
  return `${man.toLocaleString()}만원`;
}

function HouseDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const isAssetFlow = from === 'asset';
  const total = isAssetFlow ? 3 : 6;

  const currentYear = new Date().getFullYear();

  // ─── 폼 상태 ─────────────────────────────────────────────────────────
  const [address,         setAddress]         = useState('');
  const [houseType,       setHouseType]       = useState('아파트, 1주택');
  const [area,            setArea]            = useState('');
  const [acquisitionYear, setAcquisitionYear] = useState('');
  const [hasLoan,         setHasLoan]         = useState<'none' | 'exists'>('none');

  // ─── UI 상태 ─────────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted,  setIsSubmitted]  = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);
  const [isAllDone,    setIsAllDone]    = useState(false);
  const [apiResult,    setApiResult]    = useState<RealAssetLinkResult | null>(null);
  const [apiError,     setApiError]     = useState('');
  const [userName,     setUserName]     = useState('사용자');

  useEffect(() => {
    getBannerStatus().then((s) => {
      if (s.userName) setUserName(s.userName);
    });
  }, []);

  // ─── 폼 유효성: 모든 필드 필수 ───────────────────────────────────────
  const isFormValid =
    address.trim() !== '' &&
    area !== '' &&
    acquisitionYear !== '';

  // ─── 조회 실행 ────────────────────────────────────────────────────────
  const handleSearch = async () => {
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true);
    setApiError('');
    try {
      const result = await linkHousing({
        addr:             address,
        housing_type:     houseType,
        asset_size:       Number(area),
        acquisition_year: Number(acquisitionYear),
        has_loan:         hasLoan === 'exists',
      });
      setApiResult(result);
      setIsSubmitted(true);
    } catch {
      setApiError('주택 정보 조회 중 오류가 발생했어요. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── 완료 처리 ────────────────────────────────────────────────────────
  // mydata 초기 플로우: 개별 로딩 없이 바로 다음 단계(차량)로 이동
  // asset 탭 플로우:    주택 아이콘 로딩 → CompleteStep
  const handleComplete = () => {
    if (!isAssetFlow) {
      router.push('/mydata/car');
      return;
    }
    setIsLoading(true);
  };

  const handleLoadingComplete = () => { setIsLoading(false); setIsAllDone(true); };

  // ─── 완료 화면 (asset 탭 플로우 전용) ───────────────────────────────
  if (isAllDone) {
    return (
      <CompleteStep
        footer={
          <div className="w-full px-6 pb-12">
            <PrimaryButton label="확인하기" onClick={() => router.push('/asset?tab=realestate')} />
          </div>
        }
      >
        <div className="flex flex-col items-center text-center">
          <h2 className="whitespace-pre-line font-bold text-[1.5rem] text-foreground leading-[1.4] tracking-tight">
            주택 정보를{'\n'}연동했어요!
          </h2>
          <p className="mt-3 text-[1rem] text-muted-foreground">
            연동된 자산 정보는 내 자산 탭에서{'\n'}언제든지 확인할 수 있어요.
          </p>
          {apiResult && (
            <p className="mt-4 text-[1.125rem] font-semibold text-hana-teal-500">
              KB 시세 {formatAmtSync(apiResult.evalAmt)}
            </p>
          )}
        </div>
      </CompleteStep>
    );
  }

  // ─── 로딩 화면 (asset 탭 플로우 전용 — 주택 아이콘 강조) ─────────────
  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <LoadingStep assetType="house" onComplete={handleLoadingComplete} />
      </div>
    );
  }

  // ─── 확인 화면 (조회 결과) ────────────────────────────────────────────
  if (isSubmitted && apiResult) {
    return (
      <div className="flex h-full flex-col bg-background">
        <div className="flex flex-1 flex-col px-6 pt-6">
          <div className="mb-10">
            <ProgressBar step={3} total={total} />
          </div>
          <div className="mb-10">
            <PageHeading>
              <span className="text-hana-teal-500">연동된 주택</span>을{'\n'}
              확인해주세요
            </PageHeading>
          </div>

          <div className="mb-6 rounded-[20px] border border-border-gray bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-bold text-[18px] text-hana-black-900">{address}</span>
              <span className="rounded-full bg-hana-green-50 px-3 py-1 font-medium text-[12px] text-hana-green-700">
                내 집
              </span>
            </div>
            <div className="flex flex-col gap-4 text-[15px]">
              <div className="flex justify-between">
                <span className="text-hana-black-500">주택 종류</span>
                <span className="font-semibold text-hana-black-900">{houseType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-hana-black-500">면적</span>
                <span className="font-semibold text-hana-black-900">{area}m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-hana-black-500">취득연도</span>
                <span className="font-semibold text-hana-black-900">{acquisitionYear}년</span>
              </div>
              <div className="flex justify-between">
                <span className="text-hana-black-500">KB 시세</span>
                <span className="font-bold text-hana-teal-500">
                  {formatAmtSync(apiResult.evalAmt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-hana-black-500">기존 대출</span>
                <span className="font-semibold text-hana-black-900">
                  {hasLoan === 'none' ? '없음' : '있음'}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-10 flex justify-center">
            <AlertBanner
              variant="warning"
              message={`KB 시세 기준 LTV 60% 적용.\n소득·신용에 따라 실제 한도가 달라질 수 있어요.`}
              messageFont="font-medium"
            />
          </div>
        </div>
        <DualActionFooter
          leftLabel="다시 입력할게요"
          rightLabel="완료"
          onLeftClick={() => setIsSubmitted(false)}
          onRightClick={handleComplete}
        />
      </div>
    );
  }

  // ─── 입력 화면 ───────────────────────────────────────────────────────
  return (
    <div className="flex h-full flex-col bg-background px-6 pt-6 pb-12">
      <div className="mb-10">
        <ProgressBar step={2} total={total} />
      </div>
      <div className="mb-10">
        <PageHeading>
          <span className="text-hana-teal-500">주택 정보</span>를{'\n'}
          입력해주세요
        </PageHeading>
      </div>

      <div className="flex flex-col gap-6">

        {/* ── 보유 주택 정보 ────────────────────────────────────────────── */}
        <FormInput
          label="주소"
          id="address"
          placeholder="성동로 124길"
          value={address}
          onChange={setAddress}
          suffix={
            <button
              type="button"
              className="h-14 shrink-0 rounded-[10px] border border-border-gray px-4 font-medium text-[15px] text-hana-black-600 active:bg-gray-50"
            >
              주소 검색
            </button>
          }
        />

        <div className="flex flex-col">
          <label
            htmlFor="house-type"
            className="mb-2 block font-medium text-[15px] text-hana-black-800"
          >
            주택 종류
          </label>
          <div className="relative">
            <select
              id="house-type"
              className="h-14 w-full cursor-pointer appearance-none rounded-[10px] border border-border-gray bg-transparent px-4 text-[16px] outline-none transition-all focus:border-hana-teal-400"
              value={houseType}
              onChange={(e) => setHouseType(e.target.value)}
            >
              <option value="아파트, 1주택">아파트, 1주택</option>
              <option value="아파트, 다주택">아파트, 다주택</option>
              <option value="연립/다세대, 1주택">연립/다세대, 1주택</option>
            </select>
            <div className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-4 text-hana-silver-300">
              <ChevronDown size={20} />
            </div>
          </div>
        </div>

        {/* ── 면적 + 취득연도 ───────────────────────────────────────────── */}
        <div className="flex gap-4">
          <FormInput
            className="flex-1"
            label="면적 (m²)"
            id="area"
            type="number"
            placeholder="84"
            value={area}
            onChange={setArea}
          />
          <div className="flex flex-1 flex-col">
            <label
              htmlFor="acquisition-year"
              className="mb-2 block font-medium text-[15px] text-hana-black-800"
            >
              취득연도
            </label>
            <div className="relative">
              <select
                id="acquisition-year"
                className="h-14 w-full cursor-pointer appearance-none rounded-[10px] border border-border-gray bg-transparent px-4 text-[16px] outline-none transition-all focus:border-hana-teal-400"
                value={acquisitionYear}
                onChange={(e) => setAcquisitionYear(e.target.value)}
              >
                <option value="">연도 선택</option>
                {Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i).map((y) => (
                  <option key={y} value={String(y)}>{y}년</option>
                ))}
              </select>
              <div className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-4 text-hana-silver-300">
                <ChevronDown size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* ── 기존 대출 여부 ────────────────────────────────────────────── */}
        <div>
          <p className="mb-2 block font-medium text-[15px] text-hana-black-800">
            기존 대출 여부
          </p>
          <div className="flex gap-2">
            {(['none', 'exists'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setHasLoan(type)}
                className={`h-14 flex-1 rounded-[10px] font-semibold text-[16px] transition-all ${
                  hasLoan === type
                    ? 'bg-hana-teal-400 text-white'
                    : 'border border-border-gray text-hana-silver-300'
                }`}
              >
                {type === 'none' ? '없음' : '있음'}
              </button>
            ))}
          </div>
        </div>

      </div>

      {apiError && (
        <p className="mt-4 text-center text-[13px] font-medium text-red-500">{apiError}</p>
      )}

      <div className="mt-auto pt-10">
        <p className="mb-4 text-center text-[12px] text-hana-silver-300">
          입력한 주소 기반으로 KB시세를 자동으로 조회해요.
        </p>
        <PrimaryButton
          label={isSubmitting ? '조회 중…' : '조회하기'}
          variant={isFormValid && !isSubmitting ? 'primary' : 'disabled'}
          onClick={handleSearch}
        />
      </div>
    </div>
  );
}

export default function HouseDetailPage() {
  return (
    <Suspense>
      <HouseDetailContent />
    </Suspense>
  );
}
