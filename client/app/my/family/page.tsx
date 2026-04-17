'use client';

import { Check, PlusCircle, X } from 'lucide-react';
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

// --- 인터페이스 ---
interface FamilyMember {
  id: number;
  lastName: string;
  name: string;
  relationship: string;
  phone: string;
  isMe?: boolean;
  isSharing: boolean;
  sharingInsuranceCount?: number;
  circleColor: string; // Tailwind bg class
  textColor: string; // Tailwind text class
}

const getColors = (relation: string) => {
  if (relation === '본인' || relation === '배우자') {
    return {
      circleColor: 'bg-hana-green-100',
      textColor: 'text-hana-green-700',
    };
  }
  return {
    circleColor: 'bg-hana-yellow-100',
    textColor: 'text-hana-yellow-700',
  };
};

const mapResponseToFamilyMember = (res: FamilyMemberResponse): FamilyMember => {
  const colors = getColors(res.relation);
  return {
    id: res.userId,
    lastName: res.name.charAt(0),
    name: res.name,
    relationship: res.relation,
    phone: res.phone,
    isMe: res.isMe,
    isSharing: res.isSharing,
    ...colors,
  };
};

// --- 하위 컴포넌트 ---

const Stats = ({
  registeredCount,
  sharingCount,
  requestedCount,
}: {
  registeredCount: number;
  sharingCount: number;
  requestedCount: number;
}) => (
  <section className="mb-6 grid grid-cols-3 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
    <div className="flex flex-col items-center border-gray-100 border-r pr-2">
      <span className="mb-1.5 text-center font-medium text-[#333333] text-sm">
        등록된 가족
      </span>
      <span className="font-bold text-3xl text-hana-ez-600">
        {registeredCount}명
      </span>
    </div>
    <div className="flex flex-col items-center border-gray-100 border-r px-2">
      <span className="mb-1.5 text-center text-[#5A5A5A] text-sm">공유중</span>
      <span className="font-bold text-3xl text-hana-ez-600">
        {sharingCount}
      </span>
    </div>
    <div className="flex flex-col items-center pl-2">
      <span className="mb-1.5 text-center text-[#5A5A5A] text-sm">
        공유 요청
      </span>
      <span className="font-bold text-3xl text-hana-ez-600">
        {requestedCount}
      </span>
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
    <div className="group relative mb-3 flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all active:scale-[0.99]">
      <div
        className={`h-14 w-14 ${member.circleColor} flex items-center justify-center rounded-full ${member.textColor} font-bold text-2xl`}
      >
        {member.lastName}
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#1A1A1A] text-lg">
            {member.name}
          </span>
          <span
            className={`rounded-full border border-hana-ez-600 bg-white px-3 py-1 font-medium text-hana-ez-600 text-xs ${member.isMe ? '' : 'hidden'}`}
          >
            {member.relationship}
          </span>
        </div>
        <span
          className={`text-[#8A8A8A] text-sm ${member.phone ? '' : 'hidden'}`}
        >
          {member.phone}
        </span>
      </div>

      {!member.isMe && (
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={member.isSharing}
                onChange={() => onToggleSharing(member.id, member.isSharing)}
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-hana-ez-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
            </label>
          </div>

          <span
            className={`font-medium text-xs ${member.isSharing ? 'text-hana-ez-600' : 'text-[#8A8A8A]'}`}
          >
            {member.isSharing ? '공유 중' : '공유 안함'}
          </span>
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
    className="group flex cursor-pointer items-center gap-4 border-gray-100 border-b py-4"
    onClick={onSelect}
  >
    <div
      className={`h-14 w-14 ${member.circleColor} flex items-center justify-center rounded-full ${member.textColor} font-bold text-2xl`}
    >
      {member.lastName}
    </div>

    <div className="flex flex-1 flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="font-bold text-[#1A1A1A] text-xl">{member.name}</span>
        <span
          className={`rounded-full border border-hana-ez-600 bg-white px-3 py-1 font-medium text-hana-ez-600 text-xs`}
        >
          {member.relationship}
        </span>
      </div>
      <span className={`text-[#8A8A8A] text-sm`}>{member.phone}</span>
    </div>

    <div
      className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors ${isSelected ? 'border-hana-ez-600 bg-hana-ez-600' : 'border-gray-300 bg-white'}`}
    >
      {isSelected && <Check className="h-4 w-4 text-white" />}
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

// --- 메인 페이지 컴포넌트 ---

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
    if (pendingToggleId) {
      try {
        await updateInsurancePermission({
          granteeId: pendingToggleId,
          isInsView: false,
        });
        await loadFamilyMembers(); // 최신 데이터로 갱신
        setIsConfirmOpen(false);
        setPendingToggleId(null);
      } catch (error) {
        console.error('보험 공유 중단 실패:', error);
        alert('보험 공유 중단에 실패했습니다.');
      }
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
      const inviteUrl = `${window.location.origin}/onboarding?token=${token}`;
      setInviteToken(inviteUrl);
      setIsAddSheetOpen(true);
    } catch (error) {
      console.error('초대 링크 생성 실패:', error);
      alert('초대 링크를 생성하지 못했습니다.');
    }
  };

  if (loading && members.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-hana-ez-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="app-shell bg-[#F9F9F9]">
      <div className="app-layout">
        <Header
          title="가족 관리"
          onBack={() => router.push('/my/mypage' as Route)}
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
              <h2 className="font-bold text-[#1A1A1A] text-lg">가족 목록</h2>
              <span className="text-gray-400 text-sm">
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
