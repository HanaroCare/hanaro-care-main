import type { InsuranceDetail, InsuranceItem } from '../types';

export const insurances: InsuranceItem[] = [
  {
    id: 1,
    company: '하나생명',
    name: '하나 건강보험',
    monthlyPremium: '월 15만원',
    needsConfirm: true,
  },
  {
    id: 2,
    company: '하나생명',
    name: '하나 건강보험',
    monthlyPremium: '월 15만원',
  },
  {
    id: 3,
    company: '하나생명',
    name: '하나 건강보험',
    monthlyPremium: '월 15만원',
    needsConfirm: true,
  },
];

export const insuranceDetails: InsuranceDetail[] = [
  {
    id: 1,
    company: '하나생명',
    name: '암보험',
    type: '암보험',
    monthlyPremium: '10만원',
    contractDate: '2019.06.01',
    expiryDate: '2029.06.01',
  },
  {
    id: 2,
    company: '삼성생명',
    name: '건강보험',
    type: '건강보험',
    monthlyPremium: '5만원',
    contractDate: '2020.01.01',
    expiryDate: '2030.01.01',
  },
  {
    id: 3,
    company: '하나생명',
    name: '암보험',
    type: '암보험',
    monthlyPremium: null,
    contractDate: '2019.06.01',
    expiryDate: '2029.06.01',
  },
];
export const viewMode: 'GRANTEE' | 'OWNER' = 'OWNER'; // 'GRANTEE' | 'OWNER'
export const isDesignated = false;
