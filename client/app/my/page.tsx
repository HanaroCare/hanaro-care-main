'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  Dna,
  FileHeart,
  Gift,
  Handshake,
  Heart,
  LogOut,
  type LucideIcon,
  Mail,
  Shield,
  UserMinus,
  UserPlus,
  Users,
} from 'lucide-react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/navigation/Header';
import { NavigationBar } from '@/components/navigation/NavigationBar';
import { getFamilyMembers, getMe } from '@/app/my/actions/familyActions';
import { getInsurances } from '@/app/my/actions/insuranceActions';
import { getMyInfo } from '@/app/dev/actions/admin';
import { logout, withdraw } from './actions/authActions';

/**
 * My하나 마이페이지
 * - 부모/자녀 로그인 역할에 따라 분기 처리
 * - '내 미래 설계하기' 클릭 시 하단 슬라이드 애니메이션
 */
export default function MyHanaPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<'parent' | 'child'>('parent');
  const [userName, setUserName] = useState<string>('사용자');
  const [familyCount, setFamilyCount] = useState<number>(0);
  const [insuranceCount, setInsuranceCount] = useState<number>(0);

  const [isFuturePlanExpanded, setIsFuturePlanExpanded] = useState(false);
  const [isWithdrawPopupOpen, setIsWithdrawPopupOpen] = useState(false);
  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);

  useEffect(() => {
    // 1. 이름 조회 (가장 확실한 경로)
    getMe().then((name) => {
      if (name) setUserName(name);
    }).catch(err => console.error("getMe error:", err));

    // 2. 역할 조회 및 기본 정보 보완
    getMyInfo().then((info) => {
      if (info) {
        // getMe가 실패했거나 아직 안 끝났을 경우를 대비해 보완
        if (info.userName) setUserName(info.userName);
        
        if (info.userRole === 'ROLE_CHILD') {
          setUserRole('child');
        } else {
          setUserRole('parent');
        }
      }
    });

    // 2. 가족 수 조회
    getFamilyMembers().then((members) => {
      if (members) {
        setFamilyCount(members.length);
      }
    });

    // 3. 보험 수 조회
    getInsurances().then((data) => {
      if (data && data.insurances) {
        setInsuranceCount(data.insurances.length);
      }
    });
  }, []);

  const onLogoutClick = () => {
    setIsLogoutPopupOpen(true);
  };

  const handleLogout = async () => {
    await logout();
    setIsLogoutPopupOpen(false);
  };

  const handleWithdraw = async () => {
    const res = await withdraw();
    if (res.success) {
      alert('회원 탈퇴가 완료되었습니다.');
      // 세션을 완전히 초기화하기 위해 소프트 라우팅이 아닌 강제 리다이렉트
      window.location.href = '/login';
    } else {
      alert(res.message);
      setIsWithdrawPopupOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex h-full flex-col">
        <Header
          title="마이페이지"
          onBack={() => router.push('/' as Route)}
          showCloseButton={true}
          onClose={() => router.push('/' as Route)}
        />

        <main className="no-scrollbar flex-1 pb-28">
          <section className="flex flex-col items-center py-10">
            <div className="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-hana-green-100 bg-hana-green-50 shadow-sm">
              <CircleUserRound
                className="h-20 w-20 text-hana-ez-600"
                role="img"
                aria-label={`${userName}의 프로필`}
              />
            </div>
            <h2 className="font-bold text-2xl text-hana-black-900 tracking-tight">
              {userName}
            </h2>

            <button
              type="button"
              onClick={() =>
                setUserRole(userRole === 'parent' ? 'child' : 'parent')
              }
              className="mt-3 rounded-full border border-gray-200 px-3 py-1 text-[11px] text-hana-black-500 transition-colors hover:bg-gray-50"
            >
              {userRole === 'parent' ? '부모 모드' : '자녀 모드'} (전환)
            </button>

            {userRole === 'child' && (
              <div className="mt-8 flex w-full justify-around px-12 text-center">
                <div>
                  <p className="mb-1 text-hana-black-500 text-sm tracking-tight">가족</p>
                  <p className="font-bold text-2xl text-hana-green-700">{familyCount}</p>
                </div>
                <div className="h-10 w-[1px] self-center bg-border" />
                <div>
                  <p className="mb-1 text-hana-black-500 text-sm tracking-tight">보험</p>
                  <p className="font-bold text-2xl text-hana-green-700">{insuranceCount}</p>
                </div>
              </div>
            )}
          </section>

          <section className="space-y-1.5 px-6">
            <MenuItem
              Icon={Users}
              title="가족 관리"
              onClick={() => router.push('/my/family' as Route)}
            />
            <MenuItem
              Icon={Shield}
              title="가족 보험 관리"
              onClick={() => router.push('/my/insurance' as Route)}
            />

            {userRole === 'parent' ? (
              <>
                <MenuItem
                  Icon={UserPlus}
                  title="후견인 등록"
                  onClick={() => router.push('/my/guardian' as Route)}
                />
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => setIsFuturePlanExpanded(!isFuturePlanExpanded)}
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
                            onClick={() => router.push('/future/advance-directive' as Route)}
                          />
                          <SubMenuItem
                            Icon={Handshake}
                            title="새생명 나눔"
                            desc="생명을 나누세요"
                            onClick={() => router.push('/future/organ-donation' as Route)}
                          />
                          <SubMenuItem
                            Icon={Gift}
                            title="유산기부"
                            desc="당신의 이름이 희망이 됩니다"
                            onClick={() => router.push('/future/legacy-donation' as Route)}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.div
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/future/support' as Route)}
                  className="mt-8 flex cursor-pointer items-center justify-between rounded-2xl bg-hana-green-700 p-6 text-white shadow-md transition-all hover:brightness-105"
                >
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-white/20 p-2.5">
                      <Heart className="h-5 w-5 fill-white text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-[17px] leading-snug tracking-tight">나를 위한 지원제도</p>
                      <p className="mt-0.5 text-[12px] text-hana-green-50/80 tracking-tight">맞춤 혜택 바로가기</p>
                    </div>
                  </div>
                  <ChevronRight className="h-6 w-6 text-hana-green-100" />
                </motion.div>
              </>
            ) : (
              <MenuItem Icon={Mail} title="부모님 편지 보기" disabled />
            )}

            <div className="mt-8 space-y-1 pt-4 border-t border-gray-100">
              <MenuItem Icon={LogOut} title="로그아웃" onClick={onLogoutClick} />
              <MenuItem Icon={UserMinus} title="회원 탈퇴" onClick={() => setIsWithdrawPopupOpen(true)} />
            </div>
          </section>
        </main>

        <NavigationBar />
      </div>

      <ConfirmPopup
        isOpen={isLogoutPopupOpen}
        onClose={() => setIsLogoutPopupOpen(false)}
        onConfirm={handleLogout}
        title="로그아웃"
        description="정말 로그아웃 하시겠습니까?"
        confirmText="로그아웃"
      />

      <ConfirmPopup
        isOpen={isWithdrawPopupOpen}
        onClose={() => setIsWithdrawPopupOpen(false)}
        onConfirm={handleWithdraw}
        title="회원 탈퇴"
        description="정말 탈퇴하시겠습니까? 탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다."
        confirmText="탈퇴하기"
        confirmButtonClass="bg-red-500"
      />
    </div>
  );
}

function ConfirmPopup({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = '확인',
  confirmButtonClass = 'bg-hana-ez-600',
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  confirmButtonClass?: string;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="fade-in zoom-in relative w-full animate-in rounded-3xl bg-white p-8 shadow-xl duration-200">
        <div className="flex flex-col items-center text-center">
          <h3 className="mb-3 font-bold text-[#1A1A1A] text-xl">{title}</h3>
          <p className="mb-8 text-[#5A5A5A] text-sm leading-relaxed">{description}</p>
          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              className="h-14 flex-1 rounded-2xl bg-gray-100 font-bold text-[#5A5A5A]"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className={`h-14 flex-1 rounded-2xl font-bold text-white ${confirmButtonClass}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      <span className="flex-1 text-left font-semibold text-hana-black-800 tracking-tight">{title}</span>
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
  onClick,
}: {
  Icon: LucideIcon;
  title: string;
  desc: string;
  onClick?: () => void;
}) {
  return (
    <div className="group/sub flex cursor-pointer items-center justify-between" onClick={onClick}>
      <div className="flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white shadow-sm">
          <Icon className="h-5 w-5 text-hana-ez-600" />
        </div>
        <div>
          <p className="font-bold text-[15px] text-hana-black-900 leading-tight tracking-tight">{title}</p>
          <p className="mt-0.5 text-[11px] text-hana-black-500 tracking-tight">{desc}</p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-hana-black-300 transition-transform group-hover/sub:translate-x-1" />
    </div>
  );
}
