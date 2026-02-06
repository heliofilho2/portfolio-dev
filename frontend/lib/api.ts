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
  // Remove barras duplas: se API_BASE_URL termina com / e endpoint começa com /, remove uma
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const endpointPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${endpointPath}`;
  
  // Log detalhado para debug (apenas em desenvolvimento)
  if (typeof window !== 'undefined') {
    console.log(`[API] Fazendo requisição para: ${url}`);
    console.log(`[API] API_BASE_URL configurada: ${API_BASE_URL}`);
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      // Log detalhado do erro
      const errorText = await response.text().catch(() => 'Não foi possível ler o erro');
      console.error(`[API] Erro ${response.status} ${response.statusText} para ${endpoint}`);
      console.error(`[API] URL completa: ${url}`);
      console.error(`[API] Resposta do servidor: ${errorText}`);
      
      // Se for 404 ou 500, retorna valor padrão baseado no tipo esperado
      if (response.status === 404 || response.status === 500) {
        // Se o endpoint sugere que retorna array (plural), retorna array vazio
        if (endpoint.includes('/projects') || endpoint.includes('/skills') || endpoint.includes('/experiences')) {
          console.warn(`[API] Retornando array vazio para ${endpoint}`);
          return [] as T;
        }
        // Para outros (como /profile), retorna null
        console.warn(`[API] Retornando null para ${endpoint}`);
        return null as T;
      }
      
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // Se resposta vazia (204 No Content), retorna void
    if (response.status === 204) {
      return undefined as T;
    }

    const data = await response.json();
    console.log(`[API] Sucesso ao buscar ${endpoint}:`, data);
    return data;
  } catch (error) {
    // Erro de rede (CORS, conexão, etc.)
    console.error(`[API] Erro de rede ao acessar ${url}:`, error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error(`[API] Possíveis causas:`);
      console.error(`  - CORS não configurado no backend`);
      console.error(`  - URL do backend incorreta: ${API_BASE_URL}`);
      console.error(`  - Backend não está rodando`);
      console.error(`  - Variável NEXT_PUBLIC_API_URL não configurada no Vercel`);
    }
    
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
