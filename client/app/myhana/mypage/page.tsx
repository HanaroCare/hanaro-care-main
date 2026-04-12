'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, ChevronRight, Heart, X } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NavigationBar } from '@/components/NavigationBar';

/**
 * My하나 마이페이지
 * - 부모/자녀 로그인 역할에 따라 분기 처리
 * - '내 미래 설계하기' 클릭 시 하단 슬라이드 애니메이션
 */
export default function MyHanaPage() {
  const router = useRouter();
  // 실제 연동 시에는 useSession이나 전역 상태에서 가져오는 값입니다.
  const [userRole, setUserRole] = useState<'parent' | 'child'>('parent');

  const [isFuturePlanExpanded, setIsFuturePlanExpanded] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex h-full flex-col">
        {/* --- 상단 헤더 --- */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-gray-50 border-b bg-white px-6 py-4">
          <button
            type="button"
            className="rounded-full transition-colors hover:bg-gray-50"
          >
            <ArrowLeft className="h-6 w-6 text-hana-black-900" />
          </button>
          <h1 className="font-semibold text-base text-hana-black-900 tracking-tight">
            마이페이지
          </h1>
          <button
            type="button"
            className="rounded-full transition-colors hover:bg-gray-50"
          >
            <X className="h-6 w-6 text-hana-black-900" />
          </button>
        </header>

        <main className="no-scrollbar flex-1 pb-28">
          {/* --- 프로필 섹션 --- */}
          <section className="flex flex-col items-center py-10">
            <div className="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-hana-green-100 bg-hana-green-50 shadow-sm">
              <span className="text-5xl" role="img" aria-label="avatar">
                👩🏼‍💼
              </span>
            </div>
            <h2 className="font-bold text-2xl text-hana-black-900 tracking-tight">
              권하나
            </h2>

            {/* 역할 전환 버튼 (개발용/테스트용) */}
            <button
              type="button"
              onClick={() =>
                setUserRole(userRole === 'parent' ? 'child' : 'parent')
              }
              className="mt-3 rounded-full border border-gray-200 px-3 py-1 text-[11px] text-hana-black-500 transition-colors hover:bg-gray-50"
            >
              {userRole === 'parent' ? '부모 모드' : '자녀 모드'} (전환)
            </button>

            {/* [자녀 모드] 가족/보험 통계 수치 */}
            {userRole === 'child' && (
              <div className="mt-8 flex w-full justify-around px-12 text-center">
                <div>
                  <p className="mb-1 text-hana-black-500 text-sm tracking-tight">
                    가족
                  </p>
                  <p className="font-bold text-2xl text-hana-green-700">3</p>
                </div>
                <div className="h-10 w-[1px] self-center bg-border" />
                <div>
                  <p className="mb-1 text-hana-black-500 text-sm tracking-tight">
                    보험
                  </p>
                  <p className="font-bold text-2xl text-hana-green-700">5</p>
                </div>
              </div>
            )}
          </section>

          {/* --- 메뉴 리스트 영역 --- */}
          <section className="space-y-1.5 px-6">
            <MenuItem 
              icon="👥" 
              title="가족 관리" 
              onClick={() => router.push('/myhana/family')} 
            />
            <MenuItem icon="🛡️" title="가족 보험 관리" />

            {userRole === 'parent' ? (
              /* --- 부모 전용 메뉴 --- */
              <>
                <MenuItem icon="📄" title="후견인 등록" />

                {/* 내 미래 설계하기 (아코디언 슬라이드) */}
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() =>
                      setIsFuturePlanExpanded(!isFuturePlanExpanded)
                    }
                    className="group flex w-full items-center rounded-2xl p-4 transition-all hover:bg-gray-50"
                  >
                    <span className="mr-4 text-xl transition-transform group-hover:scale-110">
                      🧬
                    </span>
                    <span className="flex-1 text-left font-semibold text-hana-black-800 tracking-tight">
                      내 미래 설계하기
                    </span>
                    <motion.div
                      animate={{ rotate: isFuturePlanExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-5 w-5 text-hana-black-400" />
                    </motion.div>
                  </button>

                  {/* 슬라이드 확장 영역 (Framer Motion 적용) */}
                  <AnimatePresence>
                    {isFuturePlanExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="mt-1 overflow-hidden rounded-2xl bg-hana-silver-50"
                      >
                        <div className="space-y-5 px-6 py-5">
                          <SubMenuItem
                            icon="❤️"
                            title="연명의료 결정"
                            desc="사전연명의료의향서를 작성하세요"
                          />
                          <SubMenuItem
                            icon="🤝"
                            title="새생명 나눔"
                            desc="생명을 나누세요"
                          />
                          <SubMenuItem
                            icon="🎁"
                            title="유산기부"
                            desc="당신의 이름이 희망이 됩니다"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 하단 지원제도 배너 */}
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className="mt-8 flex cursor-pointer items-center justify-between rounded-2xl bg-hana-green-700 p-6 text-white shadow-md transition-all hover:brightness-105"
                >
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-white/20 p-2.5">
                      <Heart className="h-5 w-5 fill-white text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-[17px] leading-snug tracking-tight">
                        나를 위한 지원제도
                      </p>
                      <p className="mt-0.5 text-[12px] text-hana-green-50/80 tracking-tight">
                        맞춤 혜택 바로가기
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-6 w-6 text-hana-green-100" />
                </motion.div>
              </>
            ) : (
              /* --- 자녀 전용 메뉴 --- */
              <MenuItem icon="✉️" title="부모님 편지 보기" />
            )}
          </section>
        </main>

        {/* --- 하단 네비게이션 --- */}
        <NavigationBar />
      </div>
    </div>
  );
}

// --- 하위 컴포넌트 ---

function MenuItem({ icon, title, onClick }: { icon: string; title: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center rounded-2xl p-4 transition-all hover:bg-gray-50 active:bg-gray-100"
    >
      <span className="mr-4 text-xl transition-transform group-hover:scale-110">
        {icon}
      </span>
      <span className="flex-1 text-left font-semibold text-hana-black-800 tracking-tight">
        {title}
      </span>
      <ChevronRight className="h-5 w-5 text-hana-black-400 transition-transform group-hover:translate-x-1" />
    </button>
  );
}

function SubMenuItem({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="group/sub flex cursor-pointer items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white shadow-sm">
          <span className="text-lg">{icon}</span>
        </div>
        <div>
          <p className="font-bold text-[15px] text-hana-black-900 leading-tight tracking-tight">
            {title}
          </p>
          <p className="mt-0.5 text-[11px] text-hana-black-500 tracking-tight">
            {desc}
          </p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-hana-black-300 transition-transform group-hover/sub:translate-x-1" />
    </div>
  );
}
