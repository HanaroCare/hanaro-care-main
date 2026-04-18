'use client';

import {Check, PlusCircle, ShieldCheck, X} from 'lucide-react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import ShareSheet from '@/components/modules/ShareSheet';
import Header from '@/components/navigation/Header';
import {
  getFamilyMembers,
  updateInsurancePermission,
  inviteFamily,
} from '../actions/familyActions';
import type { FamilyMemberResponse } from './types';

interface FamilyMember {
  id: number;
  lastName: string;
  name: string;
  relationship: string;
  phone: string;
  isMe?: boolean;
  isSharing: boolean;
  sharingInsuranceCount?: number;
  circleColor: string;
  textColor: string;
  badgeColor: string;
}

const getColors = (relation: string, isMe?: boolean) => {
  if (isMe === true || relation === '본인') {
    return {
      circleColor: 'bg-hana-teal-50',
      textColor: 'text-hana-teal-700',
      badgeColor: 'bg-hana-ez-green-50 text-hana-teal-700' // 배지 색상까지 여기서 정의
    };
  }

  if (relation === '배우자') {
    return {
      circleColor: 'bg-hana-green-100',
      textColor: 'text-hana-green-700',
      badgeColor: 'bg-hana-green-100 text-hana-green-700'
    };
  }

  return {
    circleColor: 'bg-hana-gold-100',
    textColor: 'text-hana-gold-700',
    badgeColor: 'bg-hana-gold-100 text-hana-gold-700'
  };
};

const mapResponseToFamilyMember = (res: FamilyMemberResponse): FamilyMember => {
  const colors = getColors(res.relation, res.isMe);

  return {
    id: res.userId,
    lastName: res.name.charAt(0),
    name: res.name,
    relationship: res.isMe ? '본인' : res.relation, // 본인이면 텍스트도 본인으로 강제
    phone: res.phone,
    isMe: res.isMe,
    isSharing: res.isSharing,
    ...colors, // circleColor, textColor, badgeColor가 한꺼번에 들어감
  };
};

const Stats = ({
                 registeredCount,
                 sharingCount,
                 requestedCount,
               }: {
  registeredCount: number;
  sharingCount: number;
  requestedCount: number;
}) => (
    <section className="mb-6 grid grid-cols-3 rounded-2xl bg-white py-5 shadow-s">
      {/* 1. 등록된 가족 */}
      <div className="flex flex-col items-start border-hana-silver-100 border-r pl-5">
      <span className="mb-1 text-hana-black-500 text-[13px] font-medium">
        등록된 가족
      </span>
        <div className="flex items-baseline gap-0.5">
        <span className="font-bold text-2xl text-hana-black-900">
          {registeredCount}
        </span>
          <span className="text-sm font-bold text-hana-black-900">명</span>
        </div>
      </div>

      {/* 2. 공유중 */}
      <div className="flex flex-col items-start border-hana-silver-100 border-r pl-5">
      <span className="mb-1 text-hana-black-500 text-[13px] font-medium">
        공유중
      </span>
        <div className="flex items-baseline gap-0.5">
        <span className="font-bold text-2xl text-hana-teal-600">
          {sharingCount}
        </span>
          <span className="text-sm font-bold text-hana-teal-600">명</span>
        </div>
      </div>

      {/* 3. 공유 요청 */}
      <div className="flex flex-col items-start pl-5">
      <span className="mb-1 text-hana-black-500 text-[13px] font-medium">
        공유 요청
      </span>
        <div className="flex items-baseline gap-0.5">
        <span className="font-bold text-2xl text-hana-teal-600">
          {requestedCount}
        </span>
          <span className="text-sm font-bold text-hana-teal-600">건</span>
        </div>
      </div>
    </section>
);

const FamilyCard = ({
                      member,
                      onToggleSharing,
                    }: {
  member: FamilyMember;
  onToggleSharing: (id: number, currentStatus: boolean) => void;
}) => {
  return (
      <div className="group mb-4 overflow-hidden rounded-[20px] bg-white shadow-[0_8px_20px_rgba(0,0,0,0.03)] border border-hana-silver-50">
        <div className="relative flex items-center gap-4 p-5 pb-4">
          <div className={`h-14 w-14 shrink-0 aspect-square ${member.circleColor} flex items-center justify-center rounded-full ${member.textColor} font-bold text-2xl`}>
            {member.lastName}
          </div>

          <div className="flex flex-1 flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-2">
            <span className="font-bold text-hana-black-900 text-[19px] truncate">
              {member.name}
            </span>
              <span className={`rounded-md px-2 py-0.5 font-bold text-[10px] ${member.badgeColor}`}>
              {member.relationship}
            </span>
            </div>
            {member.isMe && member.phone && (
                <span className="text-hana-black-400 text-sm mt-0.5 font-medium">{member.phone}</span>
            )}
          </div>

          {!member.isMe && (
              <button type="button" className="absolute top-5 right-5 rounded-md bg-hana-red-50 px-2.5 py-1 text-xs font-bold text-hana-red-500 transition active:scale-95">
                삭제
              </button>
          )}
        </div>

        {!member.isMe && (
            <div className="flex flex-col gap-3 bg-hana-silver-50 px-5 py-4 border-t border-hana-silver-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className={`h-4 w-4 shrink-0 ${member.isSharing ? 'text-hana-teal-600' : 'text-hana-black-300'}`} />
                  <p className="text-[13px] text-hana-black-600 font-medium">
                    {member.isSharing ? (
                        <>
                          내 보험 <span className="font-bold text-hana-teal-600">{member.sharingInsuranceCount ?? 0}개</span> 공유 중
                        </>
                    ) : (
                        <span className="text-hana-black-400">보험 공유를 시작해보세요</span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold ${member.isSharing ? 'text-hana-teal-600' : 'text-hana-black-400'}`}>
                공유
              </span>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={member.isSharing}
                        onChange={() => onToggleSharing(member.id, member.isSharing)}
                    />
                    <div className="peer h-6 w-11 shrink-0 rounded-full bg-hana-silver-300 transition-all after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-md after:transition-all peer-checked:bg-hana-teal-600 peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

const BottomSheetMemberCard = ({
                                 member,
                                 isSelected,
                                 onSelect,
                               }: {
  member: FamilyMember;
  isSelected: boolean;
  onSelect: () => void;
}) => (
    <div
        className="group flex cursor-pointer items-center gap-4 border-hana-silver-100 border-b py-4 active:bg-hana-silver-50"
        onClick={onSelect}
    >
      <div
          className={`h-14 w-14 shrink-0 aspect-square ${member.circleColor} flex items-center justify-center rounded-full ${member.textColor} font-bold text-2xl`}
      >
        {member.lastName}
      </div>

      <div className="flex flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="font-bold text-hana-black-900 text-lg">{member.name}</span>
          <span
              className={`rounded-md px-2 py-0.5 font-bold text-[10px] ${
                  member.isMe ? 'bg-hana-ez-green-50 text-hana-teal-700' :
                      member.relationship === '배우자' ? 'bg-hana-green-100 text-hana-green-700' :
                          'bg-hana-gold-100 text-hana-gold-700'
              }`}
          >
          {member.relationship}
        </span>
        </div>
        <span className="text-hana-black-400 text-sm font-medium">{member.phone}</span>
      </div>

      <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
              isSelected ? 'border-hana-teal-600 bg-hana-teal-600' : 'border-hana-silver-200 bg-white'
          }`}
      >
        {isSelected && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
      </div>
    </div>
);

const ConfirmPopup = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="fade-in zoom-in relative w-full animate-in rounded-3xl bg-white p-8 shadow-xl duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <Check className="h-8 w-8 text-hana-red-500" />
          </div>
          <h3 className="mb-3 font-bold text-[#1A1A1A] text-xl">
            보험 공유 중단
          </h3>
          <p className="mb-8 text-[#5A5A5A] text-sm leading-relaxed">
            정말 공유 중단하시겠습니까?
            <br />
            중단 시 가족이 내 보험 내역을 볼 수 없게 됩니다.
          </p>
          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              className="h-14 flex-1 rounded-2xl bg-gray-100 font-bold text-[#5A5A5A]"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className="h-14 flex-1 rounded-2xl bg-hana-red-500 font-bold text-white"
            >
              중단하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 바텀 시트 컴포넌트
const BottomSheet = ({
  isOpen,
  onClose,
  nonSharingMembers,
  onRequestShare,
}: {
  isOpen: boolean;
  onClose: () => void;
  nonSharingMembers: FamilyMember[];
  onRequestShare: (id: number) => void;
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) setSelectedId(null);
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 mx-auto max-w-md transition-all duration-300 ease-out ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        className={`absolute right-0 bottom-0 left-0 z-10 rounded-t-3xl bg-white px-6 pt-4 pb-8 shadow-lg transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-gray-200"></div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-2xl text-[#1A1A1A]">
            공유할 가족 선택
          </h2>
          <button type="button" onClick={onClose} className="p-1">
            <X className="h-7 w-7 text-gray-400" />
          </button>
        </div>

        <div className="no-scrollbar mb-8 max-h-[50vh] overflow-y-auto">
          {nonSharingMembers.length > 0 ? (
            nonSharingMembers.map((member) => (
              <BottomSheetMemberCard
                key={member.id}
                member={member}
                isSelected={selectedId === member.id}
                onSelect={() => setSelectedId(member.id)}
              />
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-400 text-sm">
                공유 가능한 가족이 없습니다.
              </p>
            </div>
          )}
        </div>

        <PrimaryButton
          label="공유하기"
          onClick={() => {
            if (selectedId) {
              onRequestShare(selectedId);
            }
          }}
          disabled={!selectedId}
        />
      </div>
    </div>
  );
};


export default function FamilyManagementPage() {
  const router = useRouter();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingToggleId, setPendingToggleId] = useState<number | null>(null);
  const [inviteToken, setInviteToken] = useState<string>('');

  // 데이터 로드
  const loadFamilyMembers = async () => {
    try {
      setLoading(true);
      const data = await getFamilyMembers();
      setMembers(data.map(mapResponseToFamilyMember));
    } catch (error) {
      console.error('가족 목록을 불러오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFamilyMembers();
  }, []);

  const sharingCount = members.filter((m) => m.isSharing).length;
  const nonSharingMembers = members.filter((m) => !m.isMe && !m.isSharing);

  const handleToggleSharing = (id: number, currentStatus: boolean) => {
    if (currentStatus) {
      setPendingToggleId(id);
      setIsConfirmOpen(true);
    } else {
      setIsBottomSheetOpen(true);
    }
  };

  const confirmToggleOff = async () => {
    if (!pendingToggleId) {
      console.error("중단할 가족 ID가 없습니다.");
      return;
    }

    try {
      console.log(`보험 공유 중단 시도: ID ${pendingToggleId}`);

      await updateInsurancePermission({
        granteeId: pendingToggleId,
        isInsView: false,
      });

      await loadFamilyMembers(); // 목록 새로고침
      setIsConfirmOpen(false);
      setPendingToggleId(null);

      console.log("보험 공유 중단 완료");
    } catch (error) {
      // 3. 실패 시 구체적인 에러 확인
      alert('보험 공유 중단에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  const handleRequestShare = (selectedId: number) => {
    localStorage.setItem('pending_share_id', String(selectedId));
    router.push('/my/family/share' as Route);
    setIsBottomSheetOpen(false);
  };

  const handleAddFamily = async () => {
    try {
      // 서버에서 초대 토큰 생성
      const token = await inviteFamily({});
      // 실제 배포 시에는 도메인을 포함한 전체 URL을 구성해야 함
      const inviteUrl = `${window.location.origin}/font-config?token=${token}`;
      setInviteToken(inviteUrl);
      setIsAddSheetOpen(true);
    } catch (error) {
      console.error('초대 링크 생성 실패:', error);
      alert('초대 링크를 생성하지 못했습니다.');
    }
  };

  if (loading && members.length === 0) {
    return (
        <div className="flex h-screen items-center justify-center bg-white">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-hana-teal-600 border-t-transparent"></div>
        </div>
    );
  }

  return (
    <div className="app-shell bg-[#F9F9F9]">
      <div className="app-layout">
        <Header
          title="가족 관리"
          onBack={() => router.push('/my' as Route)}
          showCloseButton={true}
          onClose={() => router.push('/' as Route)}
        />

        <main className="app-main px-6 pt-6 pb-24">
          <Stats
            registeredCount={members.length}
            sharingCount={sharingCount}
            requestedCount={0}
          />

          <div className="mb-8">
            <PrimaryButton
              label="가족 추가하기"
              variant="secondary"
              icon={<PlusCircle className="h-5 w-5" />}
              onClick={handleAddFamily}
            />
          </div>

          <section className="mb-6">
            <div className="mb-4 flex items-center justify-between px-1">
              <h2 className="font-semi-bold text-[#1A1A1A] text-lg">가족 목록</h2>
              <span className="text-gray-400 text-[14px]">
                전체 {members.length}명
              </span>
            </div>
            <div className="space-y-3">
              {members.map((member) => (
                <FamilyCard
                  key={member.id}
                  member={member}
                  onToggleSharing={handleToggleSharing}
                />
              ))}
            </div>
          </section>

          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#EFFFFE] bg-[#EFFFFE] p-4 shadow-sm">
            <PlusCircle className="mt-0.5 h-5 w-5 shrink-0 text-hana-ez-600" />
            <p className="flex-1 text-[#333333] text-sm leading-relaxed">
              가족에게 보험 내역을 공유하면 대인 청구·조회가 가능해요
            </p>
          </div>
        </main>

        <div className="fixed right-0 bottom-0 left-0 z-10 mx-auto max-w-md bg-gradient-to-t from-[#F9F9F9] via-[#F9F9F9] to-transparent px-6 py-4">
          <PrimaryButton
            label="보험 내역 공유하기"
            onClick={() => setIsBottomSheetOpen(true)}
          />
        </div>

        <BottomSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          nonSharingMembers={nonSharingMembers}
          onRequestShare={handleRequestShare}
        />

        {isAddSheetOpen && (
          <ShareSheet
            title="가족 초대하기"
            shareUrl={inviteToken}
            onClose={() => setIsAddSheetOpen(false)}
          />
        )}

        <ConfirmPopup
          isOpen={isConfirmOpen}
          onClose={() => {
            setIsConfirmOpen(false);
            setPendingToggleId(null);
          }}
          onConfirm={confirmToggleOff}
        />
      </div>
    </div>
  );
}
