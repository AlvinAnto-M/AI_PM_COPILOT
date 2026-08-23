import api from "@/lib/api";

// -----------------------------------------
// Cluster
// -----------------------------------------

export interface Cluster {
  cluster_id: number;
  name: string;
  feedback_count: number;
}

// -----------------------------------------
// Cluster API Response
// -----------------------------------------

export interface ClusterResponse {
  success: boolean;
  clusters: Cluster[];
}

// -----------------------------------------
// PRD API Response
// -----------------------------------------

export interface PRDResponse {
  success: boolean;
  cluster_id: number;
  feedback_count: number;
  prd: string;
}

// -----------------------------------------
// Get Cluster Names
// -----------------------------------------

export async function getClusters(): Promise<Cluster[]> {
  const response = await api.get<ClusterResponse>(
    "/clusters/names"
  );

  return response.data.clusters;
}

// -----------------------------------------
// Generate PRD for Selected Cluster
// -----------------------------------------

export async function generatePRD(
  clusterId: number
): Promise<PRDResponse> {
  const response = await api.post<PRDResponse>(
    "/prd/generate",
    {
      cluster_id: clusterId,
    }
  );

  return response.data;
}