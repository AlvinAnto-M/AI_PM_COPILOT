import api from "./api";

export interface PrioritizedFeature {
  cluster_id: number;
  feature: string;
  reach: number;
  impact: number;
  confidence: number;
  effort: number;
  rice_score: number;
  feedback_count: number;
  high_priority: number;
  medium_priority: number;
  low_priority: number;
  escalated: number;
  rank: number;
}

export interface PrioritizationResponse {
  success: boolean;
  total_features: number;
  prioritization: PrioritizedFeature[];
  message?: string;
}

export async function getPrioritization(): Promise<PrioritizationResponse> {
  const response = await api.get<PrioritizationResponse>(
    "/prioritization"
  );

  return response.data;
}