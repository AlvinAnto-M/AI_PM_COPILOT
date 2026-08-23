import api from "./api";

// ============================================================
// Types
// ============================================================

export interface StrategyCluster {
  cluster_id: number;
  theme: string;
  feedback_count: number;

  high_priority: number;
  medium_priority: number;
  low_priority: number;

  escalated_count: number;

  rice_score: number;
}

export interface StrategyClustersResponse {
  success: boolean;
  total_clusters: number;
  clusters: StrategyCluster[];
}

export interface CustomerEvidence {
  feedback_count: number;

  high_priority: number;
  medium_priority: number;
  low_priority: number;

  escalated_count: number;

  priority_score: number;

  rice_score: number;

  reach: number;
  impact: number;
  confidence: number;
  effort: number;

  important_patterns: string[];
}

export interface ProductInitiative {
  title: string;
  description: string;
  expected_customer_benefit: string;
}

export interface ProductStrategy {
  cluster_id: number;
  theme: string;

  executive_summary: string;

  problem_definition: string;

  customer_pain_points: string[];

  customer_evidence: CustomerEvidence;

  strategic_importance: string;

  product_goal: string;

  strategic_objectives: string[];

  recommended_product_strategy: string;

  key_product_initiatives: ProductInitiative[];

  success_metrics: string[];

  risks_and_considerations: string[];

  expected_customer_impact: string[];

  recommended_next_steps: string[];
}

export interface StrategyResponse {
  success: boolean;

  cluster_id: number;

  theme: string;

  feedback_count: number;

  strategy: ProductStrategy;
}


// ============================================================
// Get Strategy Clusters
// ============================================================

export async function getStrategyClusters(): Promise<
  StrategyCluster[]
> {
  const response =
    await api.get<StrategyClustersResponse>(
      "/strategy/clusters"
    );

  return response.data.clusters;
}


// ============================================================
// Generate Product Strategy
// ============================================================

export async function generateProductStrategy(
  clusterId: number
): Promise<StrategyResponse> {
  const response =
    await api.post<StrategyResponse>(
      "/strategy/generate",
      {
        cluster_id: clusterId,
      }
    );

  return response.data;
}