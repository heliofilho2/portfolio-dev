# 🚀 Portfolio Dev - Helio Filho

Portfólio técnico full-stack desenvolvido com **Next.js 16** (frontend) e **.NET 8** (backend), demonstrando habilidades em desenvolvimento web moderno, arquitetura limpa e boas práticas de engenharia de software.

## 📋 Sobre o Projeto

Este é um portfólio pessoal que serve como vitrine técnica, mostrando:
- **Projetos desenvolvidos** com métricas de impacto
- **Skills técnicas** organizadas por categoria
- **Experiências profissionais** em formato timeline
- **Informações pessoais** e formas de contato

### 🎯 Características

- ✅ **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- ✅ **Backend**: .NET 8 Web API com Clean Architecture
- ✅ **Database**: PostgreSQL (Supabase)
- ✅ **Arquitetura**: Clean Architecture + SOLID Principles
- ✅ **Dark/Light Mode**: Suporte completo com persistência
- ✅ **Responsivo**: Mobile-first design
- ✅ **SEO**: Otimizado para busca
- ✅ **Deploy**: Frontend (Vercel) + Backend (Railway)

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Pages      │  │ Components   │  │   API Client │     │
│  │  (App Router)│  │  (React)     │  │  (TypeScript)│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  • Server Components (SSR/SSG)                             │
│  • Client Components (Interatividade)                       │
│  • Tailwind CSS (Styling)                                  │
│  • Framer Motion (Animações)                               │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/REST (JSON)
                        │ CORS Enabled
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (.NET 8)                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              API Layer (Controllers)                │   │
│  │  • ProfileController  • ProjectsController          │   │
│  │  • SkillsController   • ExperiencesController       │   │
│  └───────────────────────┬─────────────────────────────┘   │
│                          │ Dependency Injection            │
│                          ▼                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          Application Layer (Services)                │   │
│  │  • Business Logic  • DTOs  • Validation             │   │
│  └───────────────────────┬─────────────────────────────┘   │
│                          │ Interfaces                       │
│                          ▼                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │       Infrastructure Layer (Repositories)            │   │
│  │  • Data Access  • EF Core  • Migrations              │   │
│  └───────────────────────┬─────────────────────────────┘   │
│                          │                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            Domain Layer (Entities)                   │   │
│  │  • Profile  • Project  • Skill  • Experience        │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │ Entity Framework Core
                        │ Npgsql (PostgreSQL Driver)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              DATABASE (PostgreSQL - Supabase)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Profiles │  │ Projects │  │  Skills  │  │Experiences│  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                             │
│  • Soft Delete (IsDeleted)                                 │
│  • Timestamps (CreatedAt, UpdatedAt)                       │
│  • Indexes otimizados                                      │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Stack Tecnológica

### Frontend

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **Next.js** | 16.1.6 | Framework React com App Router, SSR, SSG |
| **React** | 19.2.3 | Biblioteca UI |
| **TypeScript** | 5.x | Type safety end-to-end |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **Framer Motion** | 12.30.0 | Biblioteca de animações |
| **clsx** | 2.1.1 | Utilitário para combinar classes CSS |

### Backend

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **.NET** | 8.0 | Framework backend |
| **Entity Framework Core** | 8.0.11 | ORM para PostgreSQL |
| **Npgsql** | 8.0.11 | Driver PostgreSQL para .NET |
| **Swagger/OpenAPI** | 6.4.0 | Documentação automática da API |

### Database

| Tecnologia | Uso |
|------------|-----|
| **PostgreSQL** | Banco de dados relacional |
| **Supabase** | PostgreSQL gerenciado (cloud) |

### DevOps

| Plataforma | Uso |
|------------|-----|
| **Vercel** | Deploy frontend (automático via Git) |
| **Railway** | Deploy backend (Docker) |
| **Supabase** | Database gerenciado |
| **GitHub** | Versionamento e CI/CD |

## 📁 Estrutura do Projeto

```
PORTIFOLIODEV/
├── frontend/                          # Next.js Application
│   ├── app/                          # App Router (pages)
│   │   ├── layout.tsx               # Root layout com metadata
│   │   ├── page.tsx                 # Home page
│   │   ├── about/                   # About page
│   │   │   └── page.tsx
│   │   ├── globals.css              # Estilos globais
│   │   ├── favicon.ico              # Favicon
│   │   └── icon.ico                 # App icon
│   ├── components/                  # React Components
│   │   ├── layout/
│   │   │   └── Header.tsx           # Header com navegação e dark mode
│   │   └── sections/
│   │       ├── HeroSection.tsx      # Hero com foto e stats
│   │       ├── SkillsMatrix.tsx      # Grid de skills
│   │       ├── ProjectsSection.tsx  # Grid de projetos
│   │       ├── ExperienceSection.tsx # Timeline de experiências
│   │       └── ContactSection.tsx   # Contato e footer
│   ├── lib/                         # Utilities
│   │   ├── api.ts                   # Cliente HTTP centralizado
│   │   └── utils.ts                 # Funções utilitárias
│   ├── public/                      # Static assets
│   │   ├── avatar.jpg               # Avatar principal
│   │   ├── avatar-abt.jpeg          # Avatar página About
│   │   └── icon.ico                 # Icon
│   ├── package.json                 # Dependências
│   ├── tailwind.config.ts           # Configuração Tailwind
│   └── tsconfig.json                # Configuração TypeScript
│
├── backend/                          # .NET 8 Solution
│   ├── Portfolio.Domain/            # Domain Layer
│   │   └── Entities/
│   │       ├── BaseEntity.cs        # Classe base (Id, Timestamps, Soft Delete)
│   │       ├── Profile.cs           # Entidade Profile (singleton)
│   │       ├── Project.cs           # Entidade Project
│   │       ├── Skill.cs             # Entidade Skill
│   │       └── Experience.cs        # Entidade Experience
│   │
│   ├── Portfolio.Application/       # Application Layer
│   │   ├── DTOs/                    # Data Transfer Objects
│   │   │   ├── ProfileDto.cs
│   │   │   ├── ProjectDto.cs
│   │   │   ├── SkillDto.cs
│   │   │   └── ExperienceDto.cs
│   │   ├── Interfaces/              # Contratos
│   │   │   ├── IProfileRepository.cs
│   │   │   ├── IProjectRepository.cs
│   │   │   ├── ISkillRepository.cs
│   │   │   ├── IExperienceRepository.cs
│   │   │   └── Services interfaces
│   │   └── Services/                # Business Logic
│   │       ├── ProfileService.cs
│   │       ├── ProjectService.cs
│   │       ├── SkillService.cs
│   │       └── ExperienceService.cs
│   │
│   ├── Portfolio.Infrastructure/    # Infrastructure Layer
│   │   ├── Data/
│   │   │   └── PortfolioDbContext.cs # EF Core DbContext
│   │   ├── Repositories/            # Implementações
│   │   │   ├── ProfileRepository.cs
│   │   │   ├── ProjectRepository.cs
│   │   │   ├── SkillRepository.cs
│   │   │   └── ExperienceRepository.cs
│   │   └── Migrations/              # Database Migrations
│   │
│   ├── Portfolio.API/               # API Layer
│   │   ├── Controllers/             # REST Controllers
│   │   │   ├── ProfileController.cs
│   │   │   ├── ProjectsController.cs
│   │   │   ├── SkillsController.cs
│   │   │   └── ExperiencesController.cs
│   │   ├── Program.cs               # Startup e DI
│   │   ├── appsettings.json         # Configurações
│   │   └── Dockerfile               # Containerização
│   │
│   └── Portfolio.sln               # Solution file
│
└── README.md                        # Este arquivo
```

## 🚀 Como Executar Localmente

### Pré-requisitos

- **Node.js** 20+ e npm
- **.NET 8 SDK**
- **PostgreSQL** (ou conta Supabase)
- **Git**

### 1. Clonar o Repositório

```bash
git clone https://github.com/heliofilho2/portfolio-dev.git
cd portfolio-dev
```

### 2. Configurar Backend

#### 2.1. Configurar Connection String

Crie o arquivo `backend/Portfolio.API/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=seu-host.supabase.co;Port=5432;Database=postgres;Username=seu-usuario;Password=sua-senha;SSL Mode=Require;Trust Server Certificate=true"
  }
}
```

**OU** use variável de ambiente:
```bash
# Windows PowerShell
$env:ConnectionStrings__DefaultConnection="Host=...;Port=5432;Database=postgres;Username=...;Password=...;SSL Mode=Require;Trust Server Certificate=true"

# Linux/Mac
export ConnectionStrings__DefaultConnection="Host=...;Port=5432;Database=postgres;Username=...;Password=...;SSL Mode=Require;Trust Server Certificate=true"
```

#### 2.2. Executar Migrations

```bash
cd backend/Portfolio.Infrastructure
dotnet ef database update --startup-project ../Portfolio.API
```

#### 2.3. Executar Backend

```bash
cd backend/Portfolio.API
dotnet run
```

A API estará disponível em: `http://localhost:5115`
Swagger: `http://localhost:5115/swagger`

### 3. Configurar Frontend

#### 3.1. Instalar Dependências

```bash
cd frontend
npm install
```

#### 3.2. Configurar Variável de Ambiente (Opcional)

Crie `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5115/api
```

#### 3.3. Executar Frontend

```bash
npm run dev
```

O frontend estará disponível em: `http://localhost:3000`

## 🏛️ Arquitetura Detalhada

### Clean Architecture

O backend segue os princípios de **Clean Architecture**, dividido em 4 camadas:

#### 1. Domain Layer (Portfolio.Domain)
- **Responsabilidade**: Entidades de negócio puras
- **Dependências**: Nenhuma (camada mais interna)
- **Contém**: Entities, Enums, Value Objects

#### 2. Application Layer (Portfolio.Application)
- **Responsabilidade**: Lógica de negócio, DTOs, Interfaces
- **Dependências**: Domain
- **Contém**: Services, DTOs, Interfaces (contratos)

#### 3. Infrastructure Layer (Portfolio.Infrastructure)
- **Responsabilidade**: Acesso a dados, implementações concretas
- **Dependências**: Domain, Application
- **Contém**: DbContext, Repositories, Migrations

#### 4. API Layer (Portfolio.API)
- **Responsabilidade**: Controllers, configuração, entrada HTTP
- **Dependências**: Domain, Application, Infrastructure
- **Contém**: Controllers, Program.cs, appsettings

### Princípios SOLID Aplicados

- **S**ingle Responsibility: Cada classe tem uma única responsabilidade
- **O**pen/Closed: Extensível sem modificar código existente
- **L**iskov Substitution: Interfaces podem ser substituídas por implementações
- **I**nterface Segregation: Interfaces específicas e coesas
- **D**ependency Inversion: Depende de abstrações, não de implementações

### Repository Pattern

Abstração da camada de acesso a dados:
- **Interface** (Application Layer): Define contrato
- **Implementação** (Infrastructure Layer): Implementa com EF Core
- **Benefícios**: Testabilidade, flexibilidade, desacoplamento

### DTOs (Data Transfer Objects)

Objetos para transferência de dados entre camadas:
- **Request DTOs**: Dados de entrada (Create, Update)
- **Response DTOs**: Dados de saída (Read)
- **Benefícios**: Separação de entidades de domínio e dados de API

## 📊 Entidades do Banco de Dados

### Profile
- **Tipo**: Singleton (apenas 1 registro)
- **Campos**: Name, Role, Location, Languages, Description, AvatarUrl, ExperienceYears, CoreEngine, Database, Email, GitHubUrl, LinkedInUrl, Specialized, Certifications, AboutText
- **Uso**: Informações pessoais exibidas no site

### Project
- **Campos**: Title, Category, Description, Tags, ImageUrl, GitHubUrl, DemoUrl, Metric1Name, Metric1Value, Metric2Name, Metric2Value, Icon, DisplayOrder, IsActive
- **Uso**: Projetos desenvolvidos com métricas de impacto

### Skill
- **Campos**: Name, Category (enum), Proficiency (0-100), DisplayOrder, IsActive
- **Categorias**: BackendSystems, ERPEcosystem, DataPerformance, IntegrationAndInfrastructure
- **Uso**: Skills técnicas organizadas por categoria

### Experience
- **Campos**: Title, Company, Description, StartDate, EndDate, IsCurrent, DisplayOrder, IsActive
- **Uso**: Histórico profissional em formato timeline

### BaseEntity (Classe Base)
- **Campos**: Id, CreatedAt, UpdatedAt, IsDeleted
- **Uso**: Todas as entidades herdam desta classe
- **Soft Delete**: IsDeleted permite exclusão lógica

## 🔄 Fluxo de Dados

### Exemplo: Buscar Profile

```
1. Frontend (Next.js)
   └─> useEffect() chama profileApi.get()
       └─> apiRequest('/profile')
           └─> fetch('https://backend.com/api/profile')

2. Backend (.NET)
   └─> ProfileController.GetProfile()
       └─> IProfileService.GetProfileAsync()
           └─> IProfileRepository.GetProfileAsync()
               └─> PortfolioDbContext.Profiles.FirstOrDefaultAsync()
                   └─> SQL: SELECT * FROM "Profiles" WHERE NOT "IsDeleted" LIMIT 1

3. Resposta
   └─> Profile (Entity)
       └─> ProfileDto (DTO)
           └─> JSON Response
               └─> Frontend recebe e atualiza estado
                   └─> React re-renderiza UI
```

## 🔐 Variáveis de Ambiente

### 🔒 Segurança da API

A API está protegida com **API Key** para endpoints de escrita (POST, PUT, DELETE). Endpoints de leitura (GET) continuam públicos.

**Configuração:**
- **Variável**: `API_KEY`
- **Onde configurar**: Railway (produção) ou `appsettings.Development.json` (local)
- **Valor**: nunca versionar — fica só na env var do Railway / `appsettings.Development.json` (gitignored)

**Como usar:**
- **Swagger (dev)**: Clique em **Authorize** (🔒) e adicione `X-API-Key` com a sua chave
- **Postman/Thunder Client**: Adicione header `X-API-Key: <sua-api-key>`
- **Produção**: Use o mesmo header `X-API-Key` em todas as requisições POST/PUT/DELETE

**Gerar token seguro:**
```bash
# Linux/Mac
openssl rand -hex 32

# Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Endpoints protegidos:**
- `POST /api/projects` - Criar projeto
- `PUT /api/projects/{id}` - Atualizar projeto
- `DELETE /api/projects/{id}` - Deletar projeto
- `POST /api/resume/en` - Upload resume EN
- `POST /api/resume/pt` - Upload resume PT
- Todos os outros POST/PUT/DELETE

**Endpoints públicos (não precisam de API Key):**
- Todos os `GET` endpoints (frontend funciona normalmente)

---

## 🔐 Variáveis de Ambiente

### Frontend (Vercel)

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `NEXT_PUBLIC_API_URL` | `https://portfolio-dev-production-d03e.up.railway.app/api` | URL base da API (sem barra no final) |

### Backend (Railway)

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `DATABASE_CONNECTION_STRING` | `postgresql://user:pass@host:5432/db` | Connection string do Supabase (formato URI) |
| `API_KEY` | `seu-token-secreto-aqui` | Token para proteger endpoints de escrita (POST/PUT/DELETE) |
| `PORT` | `8080` | Porta do Railway (injetada automaticamente) |

## 🚢 Deploy

### Frontend (Vercel)

1. Conecte o repositório GitHub ao Vercel
2. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
3. Adicione variável de ambiente: `NEXT_PUBLIC_API_URL`
4. Deploy automático a cada push para `main`

### Backend (Railway)

1. Conecte o repositório GitHub ao Railway
2. Configure:
   - **Root Directory**: `backend`
   - **Builder**: `DOCKERFILE`
   - **Dockerfile Path**: `Dockerfile`
3. Adicione variável de ambiente: `DATABASE_CONNECTION_STRING`
4. Railway gera URL pública automaticamente

## 📚 Conceitos Aprendidos

### Frontend

- **Next.js App Router**: Roteamento baseado em arquivos
- **Server vs Client Components**: Quando usar cada um
- **TypeScript**: Type safety end-to-end
- **Tailwind CSS**: Utility-first CSS
- **Dark Mode**: Implementação com localStorage
- **API Client**: Centralização de chamadas HTTP

### Backend

- **Clean Architecture**: Separação de camadas
- **SOLID Principles**: Boas práticas de design
- **Repository Pattern**: Abstração de acesso a dados
- **DTOs**: Separação de entidades e dados de API
- **Dependency Injection**: Inversão de controle
- **Entity Framework Core**: ORM para PostgreSQL
- **Migrations**: Versionamento de schema
- **Swagger**: Documentação automática

### DevOps

- **Docker**: Containerização
- **Git/GitHub**: Versionamento
- **Vercel**: Deploy frontend
- **Railway**: Deploy backend
- **Supabase**: Database gerenciado
- **CORS**: Cross-Origin Resource Sharing
- **Environment Variables**: Configuração por ambiente

## 🎓 Próximos Passos (Melhorias Futuras)

- [ ] Adicionar testes unitários (xUnit para backend, Jest para frontend)
- [ ] Implementar cache (Redis)
- [ ] Adicionar autenticação (se necessário)
- [ ] Implementar rate limiting
- [ ] Adicionar monitoramento (Sentry, Application Insights)
- [ ] Otimizar imagens (Next.js Image)
- [ ] Adicionar analytics (Google Analytics)
- [ ] Implementar CI/CD completo
- [ ] Adicionar testes E2E (Playwright)

## 📝 Licença

Este projeto é pessoal e serve como portfólio técnico.

## 👤 Autor

**Helio Filho**
- Email: heliofilho.contato@outlook.com
- GitHub: [@heliofilho2](https://github.com/heliofilho2)
- LinkedIn: [heliofilhoo](https://www.linkedin.com/in/heliofilhoo/)

---

**Desenvolvido com ❤️ usando Clean Architecture, SOLID Principles e boas práticas de engenharia de software.**
