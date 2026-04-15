'use server';

import { serverFetch } from '@/lib/serverFetch'; // 아까 만든 공통 fetch 유틸

export interface SimulationRequest {
    target_age: number;
    care_type: string;
}

export async function createSimulation(request: SimulationRequest) {
    return await serverFetch<any>('/api/asset/simulation', {
        method: 'POST',
        body: JSON.stringify(request),
    });
}
