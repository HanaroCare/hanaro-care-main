import PrimaryButton from '@/components/baseelements/PrimaryButton';
import { Shield, Smartphone } from 'lucide-react';
import type { Method } from '../types/types';

const METHODS = [
  {
    id: 'phone' as const,
    icon: Smartphone,
    title: '휴대폰 인증',
    desc: '문자 인증번호로 본인 확인',
    color: 'text-teal-500',
  },
  {
    id: 'hana' as const,
    icon: Shield,
    title: '하나인증서',
    desc: '패턴·지문·Face ID로 간편 인증',
    color: 'text-blue-500',
  },
] as const;

type Props = {
  method: Method;
  isHanaBlocked: boolean;
  onChange: (method: Method) => void;
  onNext: () => void;
};

export default function MethodSelect({ method, isHanaBlocked, onChange, onNext }: Props) {
  const canProceed = method !== null && !isHanaBlocked;

  return (
    <>
      <div className="mb-8">
        <h1 className="font-bold text-[24px] text-gray-900">
          등록 전<br />본인인증을 해주세요
        </h1>
      </div>

      <div className="mb-5 space-y-3">
        {METHODS.map(({ id, icon: Icon, title, desc, color }) => {
          const selected = method === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex w-full items-center gap-4 rounded-2xl border-2 px-4 py-5 ${
                selected ? 'border-hana-green-700 bg-[#E0F7F4]' : 'border-gray-200'
              }`}
            >
              <Icon className={color} size={20} />
              <div className="flex-1 text-left">
                <p className="font-semibold">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
              <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                selected ? 'border-hana-green-700' : 'border-gray-300'
              }`}>
                {selected && <div className="h-2.5 w-2.5 rounded-full bg-hana-green-700" />}
              </div>
            </button>
          );
        })}

        <div className="mt-12 mb-3 rounded-xl bg-gray-50 px-4 py-3 text-[12px] text-gray-500 leading-relaxed">
          인증 완료 후 공증 절차가 필요해요. <p />
          법무사 연결은 H Lounge에서 도와드려요.
        </div>
      </div>

      <PrimaryButton
        label="다음"
        variant={canProceed ? 'primary' : 'disabled'}
        onClick={onNext}
      />
      {isHanaBlocked && (
        <p className="text-sm mt-2 text-red-500">
          하나인증서로 로그인한 경우에만 하나인증서로 인증할 수 있어요.
        </p>
      )}
    </>
  );
}