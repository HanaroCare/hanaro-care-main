'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, X, PlusCircle, Check, Trash2, AlertCircle } from 'lucide-react';
import SubHeader from '@/components/SubHeader';
import PrimaryButton from '@/components/PrimaryButton';

// --- 임시 데이터 및 인터페이스 ---
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
}

const initialFamilyMembers: FamilyMember[] = [
  { id: 1, lastName: '권', name: '권하나', relationship: '본인', phone: '010-1234-5678', isMe: true, isSharing: false, circleColor: 'bg-[#9FEF9B]' },
  { id: 2, lastName: '김', name: '김영웅', relationship: '배우자', phone: '010-5678-1234', isSharing: true, sharingInsuranceCount: 3, circleColor: 'bg-[#9DD3EF]' },
  { id: 3, lastName: '김', name: '김유진', relationship: '자녀', phone: '010-9876-5432', isSharing: true, sharingInsuranceCount: 3, circleColor: 'bg-[#F9EF9B]' },
  { id: 4, lastName: '김', name: '김생명', relationship: '자녀', phone: '010-2468-1357', isSharing: false, circleColor: 'bg-[#EFDEC2]' },
];

const statsData = {
  registeredCount: 4,
  sharingCount: 2,
  requestedCount: 5,
};

// --- 하위 컴포넌트 ---

const Stats = ({ sharingCount }: { sharingCount: number }) => (
  <section className="grid grid-cols-3 bg-white rounded-3xl p-6 mb-6 shadow-sm border border-gray-100">
    <div className="flex flex-col items-center border-r border-gray-100 pr-2">
      <span className="text-[#333333] font-medium text-sm mb-1.5 text-center">등록된 가족</span>
      <span className="text-hana-ez-600 font-bold text-3xl">{statsData.registeredCount}명</span>
    </div>
    <div className="flex flex-col items-center border-r border-gray-100 px-2">
      <span className="text-[#5A5A5A] text-sm mb-1.5 text-center">공유중</span>
      <span className="text-hana-ez-600 font-bold text-3xl">{sharingCount}</span>
    </div>
    <div className="flex flex-col items-center pl-2">
      <span className="text-[#5A5A5A] text-sm mb-1.5 text-center">공유 요청</span>
      <span className="text-hana-ez-600 font-bold text-3xl">{statsData.requestedCount}</span>
    </div>
  </section>
);

const FamilyCard = ({ 
  member, 
  onToggleSharing 
}: { 
  member: FamilyMember, 
  onToggleSharing: (id: number, currentStatus: boolean) => void 
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100 relative group active:scale-[0.99] transition-all mb-3">
      <div className={`w-14 h-14 ${member.circleColor} rounded-full flex items-center justify-center text-hana-ez-600 text-2xl font-bold`}>
        {member.lastName}
      </div>
      
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-[#1A1A1A] text-lg font-bold">{member.name}</span>
          <span className={`px-3 py-1 bg-white text-hana-ez-600 border border-hana-ez-600 rounded-full text-xs font-medium ${member.isMe ? '' : 'hidden'}`}>
            {member.relationship}
          </span>
        </div>
        <span className={`text-[#8A8A8A] text-sm ${member.phone ? '' : 'hidden'}`}>{member.phone}</span>
      </div>

      {!member.isMe && (
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <button 
              type="button" 
              className="w-7 h-7 rounded-full bg-white text-[#FF6363] border border-[#FF6363] text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="가족 삭제"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={member.isSharing} 
                onChange={() => onToggleSharing(member.id, member.isSharing)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-hana-ez-600"></div>
            </label>
          </div>
          
          <span className={`text-xs font-medium ${member.isSharing ? 'text-hana-ez-600' : 'text-[#8A8A8A]'}`}>
            {member.isSharing ? '공유 중' : '공유 안함'}
          </span>
        </div>
      )}
    </div>
  );
};

const BottomSheetMemberCard = ({ member, isSelected, onSelect }: { member: any, isSelected: boolean, onSelect: () => void }) => (
  <div 
    className="flex items-center gap-4 py-4 border-b border-gray-100 group cursor-pointer" 
    onClick={onSelect}
  >
    <div className={`w-14 h-14 ${member.circleColor} rounded-full flex items-center justify-center text-hana-ez-600 text-2xl font-bold`}>
      {member.lastName}
    </div>
    
    <div className="flex-1 flex flex-col gap-1">
        <div className="flex items-center gap-2">
            <span className="text-[#1A1A1A] text-xl font-bold">{member.name}</span>
            <span className={`px-3 py-1 bg-white text-hana-ez-600 border border-hana-ez-600 rounded-full text-xs font-medium`}>
                {member.relationship}
            </span>
        </div>
        <span className={`text-[#8A8A8A] text-sm`}>{member.phone}</span>
    </div>

    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-hana-ez-600 border-hana-ez-600' : 'bg-white border-gray-300'}`}>
      {isSelected && <Check className="w-4 h-4 text-white" />}
    </div>
  </div>
);

const ConfirmPopup = ({ 
  isOpen, 
  onClose, 
  onConfirm 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onConfirm: () => void 
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full bg-white rounded-3xl p-8 shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-hana-red-500" />
          </div>
          <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">보험 공유 중단</h3>
          <p className="text-[#5A5A5A] text-sm leading-relaxed mb-8">
            정말 공유 중단하시겠습니까?<br />
            중단 시 가족이 내 보험 내역을 볼 수 없게 됩니다.
          </p>
          <div className="flex w-full gap-3">
            <button 
              onClick={onClose}
              className="flex-1 h-14 bg-gray-100 text-[#5A5A5A] rounded-2xl font-bold"
            >
              취소
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 h-14 bg-hana-red-500 text-white rounded-2xl font-bold"
            >
              중단하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 메인 페이지 컴포넌트 ---

export default function FamilyManagementPage() {
  const router = useRouter();
  const [members, setMembers] = useState<FamilyMember[]>(initialFamilyMembers);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingToggleId, setPendingToggleId] = useState<number | null>(null);

  const sharingCount = members.filter(m => m.isSharing).length;
  const nonSharingMembers = members.filter(m => !m.isMe && !m.isSharing);

  const handleToggleSharing = (id: number, currentStatus: boolean) => {
    if (currentStatus) {
      // ON -> OFF 시도 시 팝업 노출
      setPendingToggleId(id);
      setIsConfirmOpen(true);
    } else {
      // OFF -> ON 시도 시 아무 작업도 하지 않음 (하단 버튼 유도)
      return;
    }
  };

  const confirmToggleOff = () => {
    if (pendingToggleId) {
      setMembers(prev => prev.map(m => m.id === pendingToggleId ? { ...m, isSharing: false } : m));
      setIsConfirmOpen(false);
      setPendingToggleId(null);
    }
  };

  // 바텀 시트 컴포넌트
  const BottomSheet = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    return (
      <div className={`fixed inset-0 z-50 transition-all duration-300 ease-out max-w-md mx-auto ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        
        <div className={`absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl transition-transform duration-300 ease-out shadow-lg z-10 pt-4 pb-8 px-6 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#1A1A1A]">공유할 가족 선택</h2>
            <button type="button" onClick={onClose} className="p-1">
              <X className="w-7 h-7 text-gray-400" />
            </button>
          </div>
          
          <div className="max-h-[50vh] overflow-y-auto no-scrollbar mb-8">
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
                <p className="text-gray-400">공유 가능한 가족이 없습니다.</p>
              </div>
            )}
          </div>

          <PrimaryButton 
            label="공유 요청하기" 
            onClick={() => {
              if (selectedId) {
                router.push('/myhana/family/share');
                onClose();
              }
            }} 
            disabled={!selectedId}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="app-shell bg-[#F9F9F9]">
      <div className="app-layout">
        <SubHeader 
          title="가족 관리" 
          backUrl="/myhana/mypage" 
          closeUrl="/myhana/mypage" 
        />

        <main className="app-main px-6 pt-6 pb-24">
          <Stats sharingCount={sharingCount} />

          {/* 가족 추가하기 버튼 삭제됨 */}

          <section className="mb-6">
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-lg font-bold text-[#1A1A1A]">가족 목록</h2>
                <span className="text-sm text-gray-400">전체 {members.length}명</span>
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

          <div className="bg-[#EFFFFE] rounded-2xl p-4 mb-6 flex items-start gap-3 border border-[#EFFFFE] shadow-sm">
            <PlusCircle className="w-5 h-5 text-hana-ez-600 shrink-0 mt-0.5" />
            <p className="text-[#333333] text-sm leading-relaxed flex-1">
              가족에게 보험 내역을 공유하면 대인 청구·조회가 가능해요
            </p>
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-6 py-4 bg-gradient-to-t from-[#F9F9F9] via-[#F9F9F9] to-transparent z-10">
          <PrimaryButton 
            label="보험 내역 공유하기" 
            onClick={() => setIsBottomSheetOpen(true)} 
          />
        </div>

        <BottomSheet isOpen={isBottomSheetOpen} onClose={() => setIsBottomSheetOpen(false)} />
        
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
