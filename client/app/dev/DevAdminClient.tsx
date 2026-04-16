'use client';

import { useState, useTransition } from 'react';
import {
  enableAgentView,
  subscribePensionProduct,
  subscribeTrustProduct,
} from '@/app/asset/actions/admin';

type ResultState = {
  status: 'idle' | 'success' | 'error';
  message: string;
};

function AdminSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
      <p className="font-semibold text-[15px] text-[#1F2937]">{title}</p>
      <p className="mt-1 text-[13px] text-[#6A7282]">{description}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ResultBadge({ result }: { result: ResultState }) {
  if (result.status === 'idle') return null;
  const isSuccess = result.status === 'success';
  return (
    <div
      className={`mt-3 rounded-xl px-4 py-3 text-[13px] ${
        isSuccess
          ? 'bg-[#E9F8F9] text-hana-ez-600'
          : 'bg-[#FEE2E2] text-red-600'
      }`}
    >
      {result.message}
    </div>
  );
}

export default function DevAdminPage() {
  const [isPending, startTransition] = useTransition();
  const isPositiveInt = (v: string) => {
    const n = Number(v);
    return Number.isInteger(n) && n > 0;
  };

  const [trustUserId, setTrustUserId] = useState('');
  const [trustResult, setTrustResult] = useState<ResultState>({
    status: 'idle',
    message: '',
  });

  const [pensionUserId, setPensionUserId] = useState('');
  const [pensionRealAssetId, setPensionRealAssetId] = useState('');
  const [pensionResult, setPensionResult] = useState<ResultState>({
    status: 'idle',
    message: '',
  });

  const [agentUserId, setAgentUserId] = useState('');
  const [agentResult, setAgentResult] = useState<ResultState>({
    status: 'idle',
    message: '',
  });

  const handleTrustSubscribe = () => {
    const userId = Number(trustUserId);
    if (!Number.isInteger(userId) || userId <= 0) {
      setTrustResult({
        status: 'error',
        message: 'userId는 1 이상의 정수여야 합니다.',
      });
      return;
    }
    setTrustResult({ status: 'idle', message: '' });
    startTransition(async () => {
      try {
        const { userProdId } = await subscribeTrustProduct(userId);
        setTrustResult({
          status: 'success',
          message: `가입 완료 — userProdId: ${userProdId}`,
        });
      } catch (e) {
        setTrustResult({
          status: 'error',
          message: `실패: ${e instanceof Error ? e.message : String(e)}`,
        });
      }
    });
  };

  const handlePensionSubscribe = () => {
    const userId = Number(pensionUserId);
    const realAssetId = Number(pensionRealAssetId);
    if (
      !Number.isInteger(userId) ||
      !Number.isInteger(realAssetId) ||
      userId <= 0 ||
      realAssetId <= 0
    ) {
      setPensionResult({
        status: 'error',
        message: 'userId/realAssetId는 1 이상의 정수여야 합니다.',
      });
      return;
    }
    setPensionResult({ status: 'idle', message: '' });
    startTransition(async () => {
      try {
        const { userProdId } = await subscribePensionProduct(
          userId,
          realAssetId,
        );
        setPensionResult({
          status: 'success',
          message: `가입 완료 — userProdId: ${userProdId}`,
        });
      } catch (e) {
        setPensionResult({
          status: 'error',
          message: `실패: ${e instanceof Error ? e.message : String(e)}`,
        });
      }
    });
  };

  const handleEnableAgentView = () => {
    const userId = Number(agentUserId);
    if (!Number.isInteger(userId) || userId <= 0) {
      setAgentResult({
        status: 'error',
        message: 'userId는 1 이상의 정수여야 합니다.',
      });
      return;
    }
    setAgentResult({ status: 'idle', message: '' });
    startTransition(async () => {
      try {
        await enableAgentView(userId);
        setAgentResult({
          status: 'success',
          message: '대리인 열람 권한 허용 완료',
        });
      } catch (e) {
        setAgentResult({
          status: 'error',
          message: `실패: ${e instanceof Error ? e.message : String(e)}`,
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-4 py-8">
      <div className="mx-auto max-w-md">
        <div className="mb-6">
          <p className="font-bold text-[20px] text-[#1F2937]">
            관리자 테스트 패널
          </p>
          <p className="mt-1 text-[13px] text-[#6A7282]">
            개발 환경 전용 · ADMIN 권한 필요
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* 신탁 상품 가입 */}
          <AdminSection
            title="신탁 상품 가입"
            description="저장된 신탁 설계 조건을 바탕으로 상품 가입 처리"
          >
            <input
              type="number"
              placeholder="userId"
              value={trustUserId}
              onChange={(e) => setTrustUserId(e.target.value)}
              className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-[14px] outline-none focus:border-hana-ez-600"
            />
            <button
              type="button"
              disabled={!isPositiveInt(trustUserId) || isPending}
              onClick={handleTrustSubscribe}
              className="mt-3 w-full rounded-xl bg-hana-ez-600 py-3 font-semibold text-[14px] text-white disabled:opacity-40"
            >
              신탁 상품 가입
            </button>
            <ResultBadge result={trustResult} />
          </AdminSection>

          {/* 주택연금 가입 */}
          <AdminSection
            title="주택연금 상품 가입"
            description="저장된 주택연금 시뮬레이션 결과를 바탕으로 상품 가입 처리"
          >
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="userId"
                value={pensionUserId}
                onChange={(e) => setPensionUserId(e.target.value)}
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-[14px] outline-none focus:border-hana-ez-600"
              />
              <input
                type="number"
                placeholder="realAssetId"
                value={pensionRealAssetId}
                onChange={(e) => setPensionRealAssetId(e.target.value)}
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-[14px] outline-none focus:border-hana-ez-600"
              />
            </div>
            <button
              type="button"
              disabled={
                !isPositiveInt(pensionUserId) ||
                !isPositiveInt(pensionRealAssetId) ||
                isPending
              }
              onClick={handlePensionSubscribe}
              className="mt-3 w-full rounded-xl bg-hana-ez-600 py-3 font-semibold text-[14px] text-white disabled:opacity-40"
            >
              주택연금 가입
            </button>
            <ResultBadge result={pensionResult} />
          </AdminSection>

          {/* 대리인 열람 권한 허용 */}
          <AdminSection
            title="대리인 신탁 열람 권한 허용"
            description="가입 중인 신탁 상품의 대리인 열람 권한(isAgentView)을 true로 설정"
          >
            <input
              type="number"
              placeholder="userId"
              value={agentUserId}
              onChange={(e) => setAgentUserId(e.target.value)}
              className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-[14px] outline-none focus:border-hana-ez-600"
            />
            <button
              type="button"
              disabled={!isPositiveInt(agentUserId) || isPending}
              onClick={handleEnableAgentView}
              className="mt-3 w-full rounded-xl bg-hana-ez-600 py-3 font-semibold text-[14px] text-white disabled:opacity-40"
            >
              열람 권한 허용
            </button>
            <ResultBadge result={agentResult} />
          </AdminSection>
        </div>
      </div>
    </div>
  );
}
