export interface FamilyMemberResponse {
  userId: string;
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
  granteeId: string;
  isInsView: boolean;
}
