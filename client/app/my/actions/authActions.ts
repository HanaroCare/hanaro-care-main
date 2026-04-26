'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const BASE_URL =
  process.env.SPRING_API_URL ??
  process.env.API_URL ??
  (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080');

const getAuthHeader = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('ACCESS_TOKEN')?.value;
  return {
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export async function logout() {
  try {
    const response = await fetch(`${BASE_URL}/api/users/logout`, {
      method: 'POST',
      headers: await getAuthHeader(),
    });

    // 백엔드 호출 결과와 상관없이 클라이언트 쿠키는 삭제
    const cookieStore = await cookies();
    cookieStore.delete('ACCESS_TOKEN');
  } catch (error) {
    console.error('Logout error:', error);
  }
  
  redirect('/login');
}

export async function withdraw() {
  try {
    const response = await fetch(`${BASE_URL}/api/users/me`, {
      method: 'DELETE',
      headers: await getAuthHeader(),
    });

    if (response.ok) {
      const cookieStore = await cookies();
      cookieStore.delete('ACCESS_TOKEN');
      return { success: true };
    } else {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, message: errorData.message || '회원 탈퇴에 실패했습니다.' };
    }
  } catch (error) {
    console.error('Withdraw error:', error);
    return { success: false, message: '서버 연결에 실패했습니다.' };
  }
}
