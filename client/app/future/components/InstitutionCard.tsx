import { Phone } from 'lucide-react';

interface InstitutionCardProps {
  name: string;
  address: string;
  onCall: () => void;
}

export default function InstitutionCard({ name, address, onCall }: InstitutionCardProps) {
  return (
    <div className="flex flex-row items-center justify-between w-full h-[77px] px-[17px] border border-[#E3E5E8] rounded-xl bg-white">
      <div className="flex flex-col gap-[3px]">
        <span className="font-medium text-[16px] leading-[21px] text-[#1A212D]">{name}</span>
        <span className="font-normal text-[11px] leading-[18px] text-[#5E707C]">{address}</span>
      </div>
      <button
        onClick={onCall}
        className="flex items-center justify-center w-[40px] h-[40px] rounded-full"
        style={{ backgroundColor: 'rgba(0, 133, 133, 0.1)' }}
      >
        <Phone size={20} color="#008585" />
      </button>
    </div>
  );
}