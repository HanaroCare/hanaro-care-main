'use server';

import { cookies } from 'next/headers';

const getAuthHeader = async () => ({
  Authorization: `Bearer ${(await cookies()).get('ACCESS_TOKEN')?.value}`,
});

const BASE_URL =
  process.env.SPRING_API_URL ?? process.env.API_URL ?? 'http://localhost:8080';

// 상속비율 및 가족 조회
export async function getInheritanceInfo() {
  const response = await fetch(`${BASE_URL}/api/inheritance`, {
    headers: await getAuthHeader(),
    cache: 'no-store', 
  });

  if (response.status === 404) {
    console.warn('[getInheritanceInfo] 상속 설계 정보가 존재하지 않습니다.');
    return null; 
  }

  if (!response.ok) {
    throw new Error('상속 정보를 불러오지 못했습니다.');
  }

  const data = await response.json();

  return data.isSuccess ? data.data : null;
}

// 상속 편지 조회
export async function getLetter(inheritDetailId: string) {
  const response = await fetch(
    `${BASE_URL}/api/inheritance/letter/${inheritDetailId}`,
    { headers: await getAuthHeader() },
  );
  const data = await response.json();
  return data.result;
}

// 상속 편지 생성
export async function sendLetter(formData: FormData) {
  const response = await fetch(`${BASE_URL}/api/inheritance/letter`, {
    method: 'POST',
    headers: await getAuthHeader(),
    body: formData,
  });
  const data = await response.json();
  return data.result;
}

// 상속 편지 삭제
export async function deleteLetter(inheritDetailId: string) {
  const response = await fetch(
    `${BASE_URL}/api/inheritance/letter/${inheritDetailId}`,
    {
      method: 'DELETE',
      headers: await getAuthHeader(),
    },
  );

  if (!response.ok) {
    throw new Error(`편지 삭제 도중 오류가 발생했습니다: ${response.status}`);
  }

  const data = await response.json();
  return data.result;
}
