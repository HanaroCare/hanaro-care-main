export type GuardianData = {
  // Step 2: 선택된 가족 정보 (FamilySummaryDto 기반)
  selectedPerson: {
    name: string;
    phoneNumber: string;
    relationCd: string;
  } | null;

  // Step 2-2: 관계 (기본값은 relationCd지만 직접 수정할 수도 있으니 유지)
  relationship: string;

  // Step 3: 후견인 권한 (백엔드 boolean[5] 규격)
  // [재산관리, 의료결정, 요양시설, 계약체결, 법적대리] 순서
  permissions: boolean[];

  // Step 4: 본인 인증 정보 (필요 시 추가)
  userName: string;
  userPhone: string;
  verificationMethod: string;
};
