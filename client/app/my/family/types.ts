export interface FamilyMemberResponse {
  userId: number;
  name: string;
  phone: string;
  relation: string;
  isSharing: boolean;
  isMe: boolean;
}

export interface FamilyInviteRequest {
  // Empty for now as per server implementation
}

export interface GrantInsuranceViewRequest {
  granteeId: number;
  isInsView: boolean;
}
