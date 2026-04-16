'use server';

import { serverFetch } from '@/lib/serverFetch';
import {SimulationDetailApiResponse, SimulationResponse, SimulationSummaryApiResponse} from "@/app/asset/utils/types";

export interface SimulationRequest {
    target_age: number;
    care_type: string;
}

export async function createSimulation(request: SimulationRequest) {
    return await serverFetch<SimulationResponse>('/api/asset/simulation', {
        method: 'POST',
        body: JSON.stringify(request),
    });
}

export async function getSimulationSummary() {
    return await serverFetch<SimulationSummaryApiResponse>('/api/asset/simulation/summary');
}


export async function getSimulationDetail(request: SimulationRequest) {
    return await serverFetch<SimulationDetailApiResponse>('/api/asset/simulation/detail', {
        method: 'POST',
        body: JSON.stringify(request),
    });
}
