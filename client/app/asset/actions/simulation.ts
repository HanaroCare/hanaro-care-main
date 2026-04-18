'use server';

import { serverFetch, ServerFetchError } from '@/lib/serverFetch';
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

export async function getSimulationSummary(): Promise<SimulationSummaryApiResponse | null> {
    try {
        return await serverFetch<SimulationSummaryApiResponse>('/api/asset/simulation/summary');
    } catch (error) {
        if (error instanceof ServerFetchError && error.status === 404) {
            return null;
        }
        throw error;
    }
}


export async function getSimulationDetail(): Promise<SimulationDetailApiResponse | null> {
    try {
        return await serverFetch<SimulationDetailApiResponse>('/api/asset/simulation/detail');
    } catch (error) {
        if (error instanceof ServerFetchError && error.status === 404) {
            return null;
        }
        throw error;
    }
}
