'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  CircleUserRound, // Lucide 아이콘 추가
  Dna,
  FileHeart,
  Gift,
  Handshake,
  Heart,
  type LucideIcon,
  Mail,
  Shield,
  UserPlus,
  Users,
} from 'lucide-react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Header from '@/components/navigation/Header';
import { NavigationBar } from '@/components/navigation/NavigationBar';

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
        <Header
          title="마이페이지"
          onBack={() => router.push('/' as Route)}
          showCloseButton={true}
          onClose={() => router.push('/' as Route)}
        />

        <main className="no-scrollbar flex-1 pb-28">
          {/* --- 프로필 섹션 --- */}
          <section className="flex flex-col items-center py-10">
            {/* 이모티콘을 Lucide 아이콘으로 변경 */}
            <div className="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-hana-green-100 bg-hana-green-50 shadow-sm">
              <CircleUserRound
                className="h-20 w-20 text-hana-ez-600"
                role="img"
                aria-label="권하나의 프로필"
              />
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
              Icon={Users}
              title="가족 관리"
              onClick={() => router.push('/my/family' as Route)}
            />
            {/* TODO: 가족 보험 관리 기능 구현 시 연결 필요 */}
            <MenuItem Icon={Shield} title="가족 보험 관리" disabled />

            {userRole === 'parent' ? (
              /* --- 부모 전용 메뉴 --- */
              <>
                {/* TODO: 후견인 등록 기능 구현 시 연결 필요 */}
                <MenuItem Icon={UserPlus} title="후견인 등록" disabled />

                {/* 내 미래 설계하기 (아코디언 슬라이드) */}
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() =>
                      setIsFuturePlanExpanded(!isFuturePlanExpanded)
                    }
                    className="group flex w-full items-center rounded-2xl p-4 transition-all hover:bg-gray-50"
                  >
                    <Dna className="mr-4 h-6 w-6 text-hana-ez-600 transition-transform group-hover:scale-110" />
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
                            Icon={FileHeart}
                            title="연명의료 결정"
                            desc="사전연명의료의향서를 작성하세요"
                          />
                          <SubMenuItem
                            Icon={Handshake}
                            title="새생명 나눔"
                            desc="생명을 나누세요"
                          />
                          <SubMenuItem
                            Icon={Gift}
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
              <>
                {/* TODO: 부모님 편지 보기 기능 구현 시 연결 필요 */}
                <MenuItem Icon={Mail} title="부모님 편지 보기" disabled />
              </>
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

function MenuItem({
  Icon,
  title,
  onClick,
  disabled,
}: {
  Icon: LucideIcon;
  title: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group flex w-full items-center rounded-2xl p-4 transition-all ${
        disabled
          ? 'cursor-not-allowed bg-gray-50/50 opacity-50'
          : 'hover:bg-gray-50 active:bg-gray-100'
      }`}
    >
      <Icon
        className={`mr-4 h-6 w-6 ${disabled ? 'text-gray-400' : 'text-hana-ez-600'} transition-transform ${!disabled && 'group-hover:scale-110'}`}
      />
      <span className="flex-1 text-left font-semibold text-hana-black-800 tracking-tight">
        {title}
      </span>
      {!disabled && (
        <ChevronRight className="h-5 w-5 text-hana-black-400 transition-transform group-hover:translate-x-1" />
      )}
    </button>
  );
}

function SubMenuItem({
  Icon,
  title,
  desc,
}: {
  Icon: LucideIcon;
  title: string;
  desc: string;
}) {
  return (
    <div className="group/sub flex cursor-pointer items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white shadow-sm">
          <Icon className="h-5 w-5 text-hana-ez-600" />
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
