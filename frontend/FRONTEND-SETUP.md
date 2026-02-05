# Frontend - Setup Completo

## ✅ O que foi criado

### 1. Estrutura Next.js 16 (App Router)
- **TypeScript**: Type safety end-to-end
- **Tailwind CSS v4**: Utility-first CSS
- **Framer Motion**: Animações (instalado, pronto para usar)

### 2. Componentes Criados

#### Layout
- **`Header.tsx`**: 
  - Logo com inicial "H"
  - Status operacional (Available)
  - Navegação com tabs
  - Toggle dark/light mode (persistido em localStorage)

#### Seções
- **`HeroSection.tsx`**: 
  - Card principal com foto, descrição e estatísticas
  - Botões de ação (Execute Contact, Stack Audit)
  - Integrado com `SkillsMatrix`

- **`SkillsMatrix.tsx`**: 
  - Grid 4 colunas (Backend, ERP, Data, Cloud)
  - Barras de progresso com percentuais
  - Busca dados da API (com fallback para placeholder)

- **`ProjectsSection.tsx`**: 
  - Grid de cards com projetos
  - Métricas de impacto (Process Time, Sync Accuracy, etc.)
  - Tags de tecnologias
  - Ícones Material Symbols
  - Busca dados da API (com fallback)

- **`ExperienceSection.tsx`**: 
  - Timeline vertical de experiências
  - Card de console/terminal
  - Busca dados da API (com fallback)

- **`ContactSection.tsx`**: 
  - Formulário de contato (estrutura)
  - Links para redes sociais
  - Footer com informações técnicas

### 3. Utilitários

- **`lib/api.ts`**: Cliente HTTP para consumir API do backend
  - Type-safe com TypeScript
  - Funções para Projects, Skills, Experiences
  - Tratamento de erro centralizado

- **`lib/utils.ts`**: Função `cn()` para combinar classes CSS

### 4. Configurações

- **`tailwind.config.ts`**: 
  - Cores: Primary (#0F172A), Accent (#3B82F6)
  - Fontes: Inter (sans), JetBrains Mono (mono)
  - Dark mode: class-based

- **`app/globals.css`**: 
  - Estilos globais
  - Import de fontes (Google Fonts + Material Symbols)
  - Classes utilitárias (`.metric-card`)

- **`app/layout.tsx`**: 
  - Layout root com fontes otimizadas
  - Metadata para SEO

## 🎨 Design System

Baseado no HTML fornecido:
- **Cores**: Primary (slate escuro), Accent (azul vibrante)
- **Fontes**: Inter (sans), JetBrains Mono (mono)
- **Estilo**: Dashboard técnico, cards com métricas
- **Dark Mode**: Suporte completo com toggle

## 🔄 Fluxo de Dados

```
Next.js Page (Server Component)
    ↓
Componentes Client ('use client')
    ↓
useEffect → fetch da API
    ↓
Atualiza estado local
    ↓
Renderiza UI
```

**POR QUÊ Client Components para dados?**
- `useEffect` e `useState` só funcionam em Client Components
- Fetch acontece no browser (não no servidor)
- Trade-off: Menos SEO, mas mais flexibilidade

**FUTURO**: Migrar para Server Components quando possível:
- Buscar dados no servidor (SSR)
- Passar como props para componentes
- Melhor performance e SEO

## 🚀 Como Executar

```bash
cd frontend
npm run dev
```

Acesse: `http://localhost:3000`

## 🔌 Integração com Backend

O frontend está configurado para consumir a API em:
- **Desenvolvimento**: `http://localhost:5000/api`
- **Produção**: Configurar `NEXT_PUBLIC_API_URL` no `.env`

**POR QUÊ variável de ambiente?**
- Diferentes URLs para dev/prod
- Não commitar credenciais
- Facilita deploy

## 📝 Próximos Passos

1. **Conectar com Backend Real**:
   - Garantir que backend está rodando
   - Testar endpoints
   - Remover placeholders

2. **Melhorar UX**:
   - Loading states mais elaborados
   - Error boundaries
   - Skeleton loaders

3. **Animações**:
   - Adicionar Framer Motion
   - Transições suaves
   - Scroll animations

4. **SEO**:
   - Metadata dinâmica
   - Open Graph tags
   - Sitemap

5. **Performance**:
   - Image optimization (Next.js Image)
   - Code splitting
   - Lazy loading

## 🎓 Conceitos Aprendidos

### Server vs Client Components
- **Server**: Renderiza no servidor, melhor SEO, sem JavaScript
- **Client**: Interatividade, hooks, estado

### Tailwind CSS v4
- Nova sintaxe com `@theme`
- `@import` deve vir primeiro
- Classes utilitárias poderosas

### TypeScript
- Type safety end-to-end
- Interfaces compartilhadas (DTOs)
- Autocomplete funciona

### Next.js App Router
- Estrutura baseada em pastas
- `layout.tsx` para layouts compartilhados
- `page.tsx` para rotas
