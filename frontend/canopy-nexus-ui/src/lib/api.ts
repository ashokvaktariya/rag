// API service for connecting to our FastAPI backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Consultant {
  consultant_id: string;
  name: string;
  email: string;
  phone?: string;
  practice_area?: string;
  location?: string;
  consultant_status?: string;
  business_strategy_skills?: string;
  finance_skills?: string;
  law_skills?: string;
  marketing_pr_skills?: string;
  nonprofit_skills?: string;
  professional_passion?: string;
  projects_excite?: string;
  description?: string;
  keywords?: string;
  similarity_score?: number;
}

export interface SearchRequest {
  query: string;
  limit?: number;
  min_similarity?: number;
}

export interface SearchResponse {
  consultants: Consultant[];
  total_found: number;
  query: string;
  processing_time: number;
}

export interface DatabaseStats {
  total_consultants: number;
  with_embeddings: number;
  without_embeddings: number;
  status_distribution: Record<string, number>;
}

class ConsultantAPI {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async searchConsultants(request: SearchRequest): Promise<SearchResponse> {
    const response = await fetch(`${this.baseURL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getConsultant(consultantId: string): Promise<Consultant> {
    const response = await fetch(`${this.baseURL}/consultant/${consultantId}`);

    if (!response.ok) {
      throw new Error(`Failed to get consultant: ${response.statusText}`);
    }

    return response.json();
  }

  async getAllConsultants(limit: number = 50, offset: number = 0): Promise<{
    consultants: Consultant[];
    limit: number;
    offset: number;
    total: number;
  }> {
    const response = await fetch(`${this.baseURL}/consultants?limit=${limit}&offset=${offset}`);

    if (!response.ok) {
      throw new Error(`Failed to get consultants: ${response.statusText}`);
    }

    return response.json();
  }

  async getStats(): Promise<DatabaseStats> {
    const response = await fetch(`${this.baseURL}/stats`);

    if (!response.ok) {
      throw new Error(`Failed to get stats: ${response.statusText}`);
    }

    return response.json();
  }

  async healthCheck(): Promise<{
    status: string;
    database_connected: boolean;
    total_consultants: number;
    with_embeddings: number;
  }> {
    const response = await fetch(`${this.baseURL}/health`);

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }

    return response.json();
  }
}

export const consultantAPI = new ConsultantAPI();
export default consultantAPI;
