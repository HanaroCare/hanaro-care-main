'use server';

import { cookies } from 'next/headers';

export async function getUserName() {
  const token = (await cookies()).get('ACCESS_TOKEN')?.value;

  const response = await fetch(`${process.env.API_URL}/api/myhana/family/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data.result;
}
