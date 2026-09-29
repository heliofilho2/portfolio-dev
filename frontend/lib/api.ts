/**
 * Cliente HTTP para consumir a API do backend
 * 
 * POR QUÊ criar este arquivo?
 * - Centraliza configuração de API
 * - Facilita mudança de URL (dev/prod)
 * - Pode adicionar interceptors (auth, logging)
 * - Type-safe com TypeScript
 * 
 * POR QUÊ fetch nativo e não axios?
 * - Fetch é nativo do browser (sem dependência)
 * - Next.js otimiza fetch automaticamente
 * - Mais leve
 * - Trade-off: Menos features que axios (mas suficiente)
 */

// POR QUÊ esta URL?
// - Backend roda em http://localhost:5115 (HTTP) ou https://localhost:7153 (HTTPS)
// - Em produção, usar variável de ambiente NEXT_PUBLIC_API_URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5115/api';

/**
 * Tipos da API (baseados nos DTOs do backend)
 * 
 * POR QUÊ definir aqui?
 * - Type safety end-to-end
 * - Autocomplete funciona
 * - Detecta erros antes de executar
 */
export interface ProjectDto {
  id: number;
  title: string;
  category: string;
  description: string;
  tags: string;
  imageUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  metric1Name?: string;
  metric1Value?: string;
  metric2Name?: string;
  metric2Value?: string;
  icon?: string;
  displayOrder: number;
  // Campos de Case Study
  businessProblem?: string;
  technicalSolution?: string; // JSON array como string
  technicalDecisions?: string; // JSON array como string
  tradeOffs?: string; // JSON array como string
  architectureNotes?: string;
}

export interface SkillDto {
  id: number;
  name: string;
  category: number; // SkillCategory enum
  proficiency: number;
  displayOrder: number;
}

export interface ExperienceDto {
  id: number;
  title: string;
  company?: string;
  description: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  displayOrder: number;
}

export interface ProfileDto {
  id: number;
  name: string;
  role: string;
  location?: string;
  languages?: string;
  description?: string;
  avatarUrl?: string;
  experienceYears?: string;
  coreEngine?: string;
  database?: string;
  email?: string;
  gitHubUrl?: string;
  linkedInUrl?: string;
  specialized?: string;
  certifications?: string;
  aboutText?: string;
}

/**
 * Cliente API genérico
 * 
 * POR QUÊ função genérica?
 * - Reutilizável para todos os endpoints
 * - Tratamento de erro centralizado
 * - Type-safe
 */
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  // Remove barras duplas: se API_BASE_URL termina com / e endpoint começa com /, remove uma
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const endpointPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${endpointPath}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      console.error(`[API] ${response.status} ${response.statusText} em ${endpoint}`);

      // Se for 404 ou 500, retorna valor padrão baseado no tipo esperado
      if (response.status === 404 || response.status === 500) {
        if (endpoint.includes('/projects') || endpoint.includes('/skills') || endpoint.includes('/experiences')) {
          return [] as T;
        }
        return null as T;
      }
      
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // Se resposta vazia (204 No Content), retorna void
    if (response.status === 204) {
      return undefined as T;
    }

    return await response.json();
  } catch (error) {
    // Erro de rede (CORS, backend fora do ar, URL errada)
    console.error(`[API] Falha de rede em ${endpoint}:`, error);

    // Retorna valor padrão em caso de erro de rede
    if (endpoint.includes('/projects') || endpoint.includes('/skills') || endpoint.includes('/experiences')) {
      return [] as T;
    }
    return null as T;
  }
}

/**
 * API de Projects
 */
export const projectsApi = {
  getAll: () => apiRequest<ProjectDto[]>('/projects'),
  getById: (id: number) => apiRequest<ProjectDto>(`/projects/${id}`),
};

/**
 * API de Skills
 */
export const skillsApi = {
  getAll: () => apiRequest<SkillDto[]>('/skills'),
  getByCategory: (category: number) => apiRequest<SkillDto[]>(`/skills/category/${category}`),
  getById: (id: number) => apiRequest<SkillDto>(`/skills/${id}`),
};

/**
 * API de Experiences
 */
export const experiencesApi = {
  getAll: () => apiRequest<ExperienceDto[]>('/experiences'),
  getCurrent: () => apiRequest<ExperienceDto>('/experiences/current'),
  getById: (id: number) => apiRequest<ExperienceDto>(`/experiences/${id}`),
};

/**
 * API de Profile
 */
export const profileApi = {
  get: () => apiRequest<ProfileDto>('/profile'),
};

/**
 * API de Resume/CV
 */
export const resumeApi = {
  /**
   * Retorna URL para download do Resume (EN)
   */
  downloadEn: (): string => {
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    return `${baseUrl}/resume/en`;
  },
  /**
   * Retorna URL para download do CV (PT-BR)
   */
  downloadPt: (): string => {
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    return `${baseUrl}/resume/pt`;
  },
};
