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
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    // Para outros erros, loga mas não quebra a aplicação
    console.error(`API Error: ${response.status} ${response.statusText} for ${endpoint}`);
    
    // Se for 404 ou 500, retorna valor padrão baseado no tipo esperado
    if (response.status === 404 || response.status === 500) {
      // Se o endpoint sugere que retorna array (plural), retorna array vazio
      if (endpoint.includes('/projects') || endpoint.includes('/skills') || endpoint.includes('/experiences')) {
        return [] as T;
      }
      // Para outros (como /profile), retorna null
      return null as T;
    }
    
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  // Se resposta vazia (204 No Content), retorna void
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
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
