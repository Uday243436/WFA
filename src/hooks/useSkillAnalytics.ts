import { useQuery } from '@tanstack/react-query';
import type { SkillAnalyticsResponse } from '../types/api.types';
import { fetchSkillAnalytics } from '../services/skillService';

export function useSkillAnalytics() {
  return useQuery<SkillAnalyticsResponse, Error>({
    queryKey: ['skill-analytics'],
    queryFn: fetchSkillAnalytics,
    staleTime: 2 * 60_000,
    gcTime: 10 * 60_000,
    retry: 2,
  });
}
