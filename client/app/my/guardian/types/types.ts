export type StepProps = {
  data?: GuardianData;
  onChange?: (u: Partial<GuardianData>) => void;
  onNext: () => void;
  onPrev?: () => void;
  goTo?: (step: number) => void;
};

export type Notary = {
  name: string;
  address: string;
  distance: string;
  phone: string;
  lat: number;
  lng: number;
};

export type GuardianData = {
  // Step 2: 선택된 가족 정보
  selectedPerson: {
    name: string;
    phoneNumber: string;
    relationCd: string;
  } | null;

  // Step 2-2: 관계
  relationship: string;

  // Step 3: 후견인 권한
  // [재산관리, 의료결정, 요양시설, 계약체결, 법적대리] 순서
  permissions: boolean[];

  // Step 4: 본인 인증 정보
  userName: string;
  userPhone: string;
  verificationMethod: string;
};
// 후견인 가족 요약 정보

export interface FamilySummaryDto {
  name: string;
  phoneNumber: string;
  relationCd: string;
}
// 계약서 생성을 위한 데이터

export interface ContractDto {
  guardianName: string;
  guardianRelation: string;
  permission: boolean[]; // [재산, 의료, 요양, 계약, 법적대리] (길이 5 고정)
}
