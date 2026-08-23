import api from "./api";

export interface RoadmapPriority {
  high: number;
  medium: number;
  low: number;
}

export interface RoadmapItem {
  cluster_id: number;
  initiative: string;
  feedback_count: number;

  priority: RoadmapPriority;

  priority_score: number | null;
  rice_score: number | null;

  escalated_count: number;

  roadmap_score: number;

  recommended_milestone: string;
  timeframe: string;

  reason: string;

  rank: number;
}

export interface RoadmapResponse {
  success: boolean;
  total_initiatives: number;
  roadmap: RoadmapItem[];
}

export async function getRoadmap(): Promise<RoadmapResponse> {
  const response = await api.get<RoadmapResponse>("/roadmap");

  return response.data;
}