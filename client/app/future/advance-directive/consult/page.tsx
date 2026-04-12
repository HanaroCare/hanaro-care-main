'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, X, Search } from 'lucide-react';
import { Route } from 'next';
import InstitutionCard from './components/InstitutionCard';

const institutions = [
  { name: '국립연명의료관리기관', address: '서울시 중구 을지로 245', phone: '02-1234-5678' },
  { name: '서울대병원 완화의료센터', address: '서울시 중구 을지로 245', phone: '02-1234-5679' },
  { name: '세브란스병원 호스피스팀', address: '서울시 중구 을지로 245', phone: '02-1234-5680' },
  { name: '삼성서울병원 완화의료팀', address: '서울시 중구 을지로 245', phone: '02-1234-5681' },
  { name: '아산병원 호스피스센터', address: '서울시 중구 을지로 245', phone: '02-1234-5682' },
];

export default function ConsultPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = institutions.filter(
    (item) => item.name.includes(search) || item.address.includes(search)
  );

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <div className="flex flex-row justify-between items-center px-4 h-[65px] border-b border-black/10">
        <button onClick={() => router.back()} className="p-1">
          <ChevronLeft size={24} color="#0A0A0A" />
        </button>
        <span className="font-medium text-[16px] leading-[24px] tracking-[-0.04em] text-[#0A0A0A]">
          연명의료 결정
        </span>
        <button onClick={() => router.push('/future' as Route)} className="p-1">
          <X size={24} color="#0A0A0A" />
        </button>
      </div>

      {/* 검색창 */}
      <div className="mx-[27px] mt-[51px]">
        <div className="flex flex-row items-center gap-[5px] h-[50px] px-[17px] border border-[#E3E5E8] rounded-[10px] bg-white">
          <Search size={15} color="#D1D5DB" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="기관명 또는 주소 검색"
            className="flex-1 font-normal text-[14px] leading-[21px] text-[#D1D5DB] placeholder:text-[#D1D5DB] outline-none"
          />
        </div>
      </div>

      {/* 목록 타이틀 */}
      <span className="mx-[25px] mt-[49px] font-medium text-[18px] leading-[20px] text-[#535C6A]">
        사전연명의료의향서 등록기관
      </span>

      {/* 기관 목록 */}
      <div className="flex flex-col gap-[15px] mx-[25px] mt-[18px]">
        {filtered.map((item) => (
          <InstitutionCard
            key={item.name}
            name={item.name}
            address={item.address}
            onCall={() => handleCall(item.phone)}
          />
        ))}
      </div>
    </div>
  );
}