'use client';

import { Building2, Search, ShieldCheck, UserRound } from 'lucide-react';
import { useMemo, useState, useTransition } from 'react';
import {
  type AdminRealAssetItem,
  type AdminUserDetail,
  type AdminUserSearchItem,
  enableAgentView,
  getAdminUserAssets,
  getAdminUserDetail,
  searchAdminUsers,
  subscribePensionProduct,
  subscribeTrustProduct,
} from './actions/admin';

type ResultState = {
  status: 'idle' | 'success' | 'error';
  message: string;
};

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <div className="mb-4">
        <p className="text-[16px] font-semibold text-[#111827]">{title}</p>
        <p className="mt-1 text-[13px] leading-5 text-[#6A7282]">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}

function ResultBanner({ result }: { result: ResultState }) {
  if (result.status === 'idle') return null;

  const isSuccess = result.status === 'success';

  return (
    <div
      className={`mt-4 rounded-xl px-4 py-3 text-[13px] leading-5 ${
        isSuccess
          ? 'bg-[#E9F8F9] text-hana-ez-600'
          : 'bg-[#FEE2E2] text-red-600'
      }`}
    >
      {result.message}
    </div>
  );
}

function EmptyBox({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#D1D5DB] bg-[#F9FAFB] px-4 py-6 text-center text-[13px] text-[#6A7282]">
      {text}
    </div>
  );
}

function formatWon(value: number | null | undefined) {
  if (typeof value !== 'number') return '-';
  return `${value.toLocaleString()}원`;
}

export default function DevAdminClient() {
  const [isPending, startTransition] = useTransition();

  const [keyword, setKeyword] = useState('');
  const [searchResult, setSearchResult] = useState<AdminUserSearchItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUserDetail | null>(
    null,
  );
  const [realAssets, setRealAssets] = useState<AdminRealAssetItem[]>([]);

  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const [trustResult, setTrustResult] = useState<ResultState>({
    status: 'idle',
    message: '',
  });
  const [pensionResult, setPensionResult] = useState<ResultState>({
    status: 'idle',
    message: '',
  });
  const [agentResult, setAgentResult] = useState<ResultState>({
    status: 'idle',
    message: '',
  });

  const [selectedRealAssetId, setSelectedRealAssetId] = useState<number | null>(
    null,
  );

  const handleSearch = () => {
    const q = keyword.trim();

    if (!q) {
      setSearchResult([]);
      return;
    }

    setIsSearching(true);
    setSelectedUser(null);
    setRealAssets([]);
    setSelectedRealAssetId(null);
    setTrustResult({ status: 'idle', message: '' });
    setPensionResult({ status: 'idle', message: '' });
    setAgentResult({ status: 'idle', message: '' });

    startTransition(async () => {
      try {
        const result = await searchAdminUsers(q);
        setSearchResult(result);
      } catch (e) {
        setSearchResult([]);
      } finally {
        setIsSearching(false);
      }
    });
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUser(null);
    setRealAssets([]);
    setSelectedRealAssetId(null);
    setTrustResult({ status: 'idle', message: '' });
    setPensionResult({ status: 'idle', message: '' });
    setAgentResult({ status: 'idle', message: '' });
    setIsLoadingDetail(true);

    startTransition(async () => {
      try {
        const [user, assets] = await Promise.all([
          getAdminUserDetail(userId),
          getAdminUserAssets(userId),
        ]);

        setSelectedUser(user);
        setRealAssets(assets);
        setSelectedRealAssetId(assets[0]?.realAssetId ?? null);
      } catch (e) {
        setSelectedUser(null);
        setRealAssets([]);
        setSelectedRealAssetId(null);
      } finally {
        setIsLoadingDetail(false);
      }
    });
  };

  const handleTrustSubscribe = () => {
    if (!selectedUser) {
      setTrustResult({
        status: 'error',
        message: '사용자를 먼저 선택해주세요.',
      });
      return;
    }

    setTrustResult({ status: 'idle', message: '' });

    startTransition(async () => {
      try {
        const userProdId = await subscribeTrustProduct(selectedUser.userId);
        setTrustResult({
          status: 'success',
          message: `신탁 상품 가입 완료 — userProdId: ${userProdId}`,
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
    if (!selectedUser || !selectedRealAssetId) {
      setPensionResult({
        status: 'error',
        message: '가입할 부동산 자산을 먼저 선택해주세요.',
      });
      return;
    }

    setPensionResult({ status: 'idle', message: '' });

    startTransition(async () => {
      try {
        const userProdId = await subscribePensionProduct(
          selectedUser.userId,
          selectedRealAssetId,
        );
        setPensionResult({
          status: 'success',
          message: `주택연금 상품 가입 완료 — userProdId: ${userProdId}`,
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
    if (!selectedUser) {
      setAgentResult({
        status: 'error',
        message: '사용자를 먼저 선택해주세요.',
      });
      return;
    }

    setAgentResult({ status: 'idle', message: '' });

    startTransition(async () => {
      try {
        const message = await enableAgentView(selectedUser.userId);
        setAgentResult({
          status: 'success',
          message: message || '대리인 열람 권한 허용 완료',
        });
      } catch (e) {
        setAgentResult({
          status: 'error',
          message: `실패: ${e instanceof Error ? e.message : String(e)}`,
        });
      }
    });
  };

  const selectedAsset = useMemo(
    () =>
      realAssets.find((asset) => asset.realAssetId === selectedRealAssetId) ??
      null,
    [realAssets, selectedRealAssetId],
  );

  return (
    <div className="min-h-screen bg-[#F3F4F6] px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 rounded-3xl bg-[#111827] px-6 py-6 text-white shadow-lg">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="text-[24px] font-bold leading-8">
                관리자 테스트 패널
              </p>
              <p className="mt-1 text-[14px] text-white/70">
                사용자 검색, 자산 조회, 신탁/주택연금 가입, 대리인 권한 부여
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_1.4fr]">
          <div className="space-y-4">
            <SectionCard
              title="사용자 검색"
              description="이름, 로그인 아이디, 전화번호 등으로 사용자를 검색합니다."
            >
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search
                    size={16}
                    className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#9CA3AF]"
                  />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch();
                    }}
                    placeholder="이름 / 아이디 / 전화번호"
                    className="w-full rounded-xl border border-[#E5E7EB] bg-white py-3 pr-4 pl-10 text-[14px] outline-none focus:border-hana-ez-600"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={!keyword.trim() || isPending}
                  className="rounded-xl bg-hana-ez-600 px-4 py-3 text-[14px] font-semibold text-white disabled:opacity-40"
                >
                  검색
                </button>
              </div>

              <div className="mt-4">
                {isSearching ? (
                  <EmptyBox text="검색 중입니다." />
                ) : searchResult.length === 0 ? (
                  <EmptyBox text="검색 결과가 없습니다." />
                ) : (
                  <div className="flex max-h-[360px] flex-col gap-2 overflow-y-auto">
                    {searchResult.map((user) => (
                      <button
                        key={user.userId}
                        type="button"
                        onClick={() => handleSelectUser(user.userId)}
                        className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-left transition hover:border-hana-ez-600 hover:bg-[#F9FFFE]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[14px] font-semibold text-[#111827]">
                              {user.userName}
                            </p>
                            <p className="mt-1 text-[12px] text-[#6A7282]">
                              userId: {user.userId} · loginId: {user.loginId}
                            </p>
                            <p className="mt-1 text-[12px] text-[#6A7282]">
                              {user.phoneNumber ?? '-'}
                            </p>
                          </div>
                          <span className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-[11px] font-semibold text-[#4F46E5]">
                            {user.userRole}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </SectionCard>
          </div>

          <div className="space-y-4">
            <SectionCard
              title="선택한 사용자"
              description="현재 선택된 사용자 정보와 연동된 부동산 자산을 확인합니다."
            >
              {isLoadingDetail ? (
                <EmptyBox text="사용자 정보를 불러오는 중입니다." />
              ) : !selectedUser ? (
                <EmptyBox text="왼쪽에서 사용자를 먼저 선택해주세요." />
              ) : (
                <>
                  <div className="rounded-2xl bg-[#F9FAFB] p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E9F8F9] text-hana-ez-600">
                        <UserRound size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[17px] font-bold text-[#111827]">
                          {selectedUser.userName}
                        </p>
                        <p className="mt-1 text-[13px] text-[#6A7282]">
                          userId: {selectedUser.userId} · loginId:{' '}
                          {selectedUser.loginId}
                        </p>
                        <p className="mt-1 text-[13px] text-[#6A7282]">
                          {selectedUser.phoneNumber ?? '-'} ·{' '}
                          {selectedUser.userRole}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="mb-2 text-[14px] font-semibold text-[#111827]">
                      연동 부동산 자산
                    </p>

                    {realAssets.length === 0 ? (
                      <EmptyBox text="연동된 부동산 자산이 없습니다." />
                    ) : (
                      <div className="flex flex-col gap-2">
                        {realAssets.map((asset) => {
                          const selected =
                            selectedRealAssetId === asset.realAssetId;

                          return (
                            <button
                              key={asset.realAssetId}
                              type="button"
                              onClick={() =>
                                setSelectedRealAssetId(asset.realAssetId)
                              }
                              className={`rounded-xl border px-4 py-3 text-left transition ${
                                selected
                                  ? 'border-hana-ez-600 bg-[#F9FFFE]'
                                  : 'border-[#E5E7EB] bg-white'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3F4F6] text-[#4B5563]">
                                  <Building2 size={18} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[14px] font-semibold text-[#111827]">
                                    {asset.assetNm}
                                  </p>
                                  <p className="mt-1 text-[12px] leading-5 text-[#6A7282]">
                                    realAssetId: {asset.realAssetId}
                                  </p>
                                  <p className="mt-1 text-[12px] leading-5 text-[#6A7282]">
                                    {asset.addr ?? '-'}
                                  </p>
                                  <p className="mt-1 text-[12px] leading-5 text-[#6A7282]">
                                    평가금액 {formatWon(asset.evalAmt)}
                                  </p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </SectionCard>

            <SectionCard
              title="관리 액션"
              description="선택한 사용자 기준으로 테스트 액션을 실행합니다."
            >
              {!selectedUser ? (
                <EmptyBox text="사용자를 선택한 뒤 액션을 실행할 수 있습니다." />
              ) : (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-[#E5E7EB] p-4">
                    <p className="text-[14px] font-semibold text-[#111827]">
                      신탁 상품 가입
                    </p>
                    <p className="mt-1 text-[12px] text-[#6A7282]">
                      저장된 신탁 설계 조건을 바탕으로 상품 가입 처리
                    </p>
                    <button
                      type="button"
                      onClick={handleTrustSubscribe}
                      disabled={isPending}
                      className="mt-3 w-full rounded-xl bg-hana-ez-600 py-3 text-[14px] font-semibold text-white disabled:opacity-40"
                    >
                      신탁 상품 가입
                    </button>
                    <ResultBanner result={trustResult} />
                  </div>

                  <div className="rounded-2xl border border-[#E5E7EB] p-4">
                    <p className="text-[14px] font-semibold text-[#111827]">
                      주택연금 상품 가입
                    </p>
                    <p className="mt-1 text-[12px] text-[#6A7282]">
                      선택한 부동산 자산 기준으로 주택연금 가입 처리
                    </p>
                    <div className="mt-3 rounded-xl bg-[#F9FAFB] px-4 py-3 text-[13px] text-[#4B5563]">
                      선택 자산:{' '}
                      {selectedAsset
                        ? `${selectedAsset.assetNm} (${selectedAsset.realAssetId})`
                        : '없음'}
                    </div>
                    <button
                      type="button"
                      onClick={handlePensionSubscribe}
                      disabled={isPending || !selectedRealAssetId}
                      className="mt-3 w-full rounded-xl bg-hana-ez-600 py-3 text-[14px] font-semibold text-white disabled:opacity-40"
                    >
                      주택연금 상품 가입
                    </button>
                    <ResultBanner result={pensionResult} />
                  </div>

                  <div className="rounded-2xl border border-[#E5E7EB] p-4">
                    <p className="text-[14px] font-semibold text-[#111827]">
                      대리인 신탁 열람 권한 허용
                    </p>
                    <p className="mt-1 text-[12px] text-[#6A7282]">
                      가입 중인 신탁 상품의 대리인 열람 권한 허용
                    </p>
                    <button
                      type="button"
                      onClick={handleEnableAgentView}
                      disabled={isPending}
                      className="mt-3 w-full rounded-xl bg-hana-ez-600 py-3 text-[14px] font-semibold text-white disabled:opacity-40"
                    >
                      열람 권한 허용
                    </button>
                    <ResultBanner result={agentResult} />
                  </div>
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
