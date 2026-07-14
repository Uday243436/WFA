import type { ChartSegment, SkillGap } from '../models/DashboardModels';
import { skillDistributionData, skillGapData } from '../constants/ChartConfig';
import type { SkillAnalyticsResponse } from '../types/api.types';
import { createSkillAnalyticsResponse } from '../utils/dataTransformers';
import apiClient, { shouldUseMockFallback } from './apiClient';

export async function fetchSkillAnalytics(): Promise<SkillAnalyticsResponse> {
  if (shouldUseMockFallback()) {
    return createSkillAnalyticsResponse(skillGapData, skillDistributionData, 'mock');
  }

  try {
    const response = await apiClient.get<SkillAnalyticsResponse>('/skill-analytics');
    return response.data;
  } catch (error) {
    if (shouldUseMockFallback(error)) {
      return createSkillAnalyticsResponse(skillGapData, skillDistributionData, 'mock');
    }
    throw error;
  }
}

export async function fetchSkillGaps(): Promise<SkillGap[]> {
  const response = await fetchSkillAnalytics();
  return response.skills;
}

export async function fetchSkillDistribution(): Promise<ChartSegment[]> {
  const response = await fetchSkillAnalytics();
  return response.distribution;
}
