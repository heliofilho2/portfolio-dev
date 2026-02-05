# 🚀 Portfolio Dev - Helio Filho

Portfólio técnico full-stack desenvolvido com **Next.js** (frontend) e **.NET 8** (backend), demonstrando habilidades em desenvolvimento web moderno, arquitetura limpa e boas práticas.

## 📋 Sobre o Projeto

Este é um portfólio pessoal que serve como vitrine técnica, mostrando:
- Projetos desenvolvidos
- Skills técnicas
- Experiências profissionais
- Informações pessoais e contato

### 🎯 Características

- ✅ **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS
- ✅ **Backend**: .NET 8 Web API com Clean Architecture
- ✅ **Database**: PostgreSQL (Supabase)
- ✅ **Arquitetura**: Clean Architecture + SOLID Principles
- ✅ **Dark/Light Mode**: Suporte completo
- ✅ **Responsivo**: Mobile-first design
- ✅ **SEO**: Otimizado para busca

## 🏗️ Arquitetura

```
┌─────────────────┐
│   Frontend      │  Next.js + TypeScript
│   (Vercel)      │  Tailwind CSS + Framer Motion
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│   Backend       │  .NET 8 Web API
│   (Azure)       │  Clean Architecture
└────────┬────────┘
         │ EF Core
         ▼
┌─────────────────┐
│   Database      │  PostgreSQL
│   (Supabase)    │  Migrations
└─────────────────┘
```

## 🚀 Como Executar Localmente

### Pré-requisitos

- Node.js 20+ e npm
- .NET 8 SDK
- PostgreSQL (ou Supabase)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse: `http://localhost:3000`

### Backend

1. Configure a connection string em `backend/Portfolio.API/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "sua_connection_string_aqui"
  }
}
```

2. Execute as migrations:

```bash
cd backend/Portfolio.Infrastructure
dotnet ef database update --startup-project ../Portfolio.API
```

3. Execute a API:

```bash
cd backend/Portfolio.API
dotnet run
```

Acesse: `http://localhost:5115/swagger`

## 📁 Estrutura do Projeto

```
PORTIFOLIODEV/
├── frontend/              # Next.js App
│   ├── app/              # App Router (pages)
│   ├── components/       # React Components
│   ├── lib/              # Utilities & API Client
│   └── public/           # Static assets
│
├── backend/              # .NET 8 API
│   ├── Portfolio.Domain/         # Entities
│   ├── Portfolio.Application/    # DTOs, Services, Interfaces
│   ├── Portfolio.Infrastructure/ # DbContext, Repositories, Migrations
│   └── Portfolio.API/            # Controllers, Program.cs
│
└── README.md
```

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 16** - Framework React com App Router
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first CSS
- **Framer Motion** - Animações
- **React 19** - Biblioteca UI

### Backend
- **.NET 8** - Framework backend
- **Entity Framework Core** - ORM
- **PostgreSQL** - Database
- **Swagger/OpenAPI** - Documentação API
- **Clean Architecture** - Separação de camadas

### DevOps
- **Supabase** - PostgreSQL gerenciado
- **Vercel** - Deploy frontend
- **Azure** - Deploy backend (planejado)

## 📚 Documentação

- `backend/ARCHITECTURE.md` - Arquitetura do backend
- `backend/BACKEND-COMPLETE.md` - Resumo do backend
- `PROJETO-STATUS.md` - Status e próximos passos
- `frontend/FRONTEND-SETUP.md` - Setup do frontend

## 🔐 Variáveis de Ambiente

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5115
```

### Backend (appsettings.Development.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "sua_connection_string"
  }
}
```

**⚠️ IMPORTANTE**: Não commitar arquivos com secrets (`.env`, `appsettings.Development.json`)

## 📝 API Endpoints

- `GET /api/profile` - Obter perfil
- `PUT /api/profile` - Criar/Atualizar perfil
- `GET /api/projects` - Listar projetos ativos
- `GET /api/skills` - Listar skills ativas
- `GET /api/experiences` - Listar experiências

Documentação completa: `http://localhost:5115/swagger`

## 🎨 Features

- ✅ Dark/Light mode toggle
- ✅ Responsive design
- ✅ Animações suaves (Framer Motion)
- ✅ SEO otimizado
- ✅ Página About com texto pessoal
- ✅ Seções: Hero, Skills, Projects, Experience, Contact

## 🚀 Deploy

### Frontend (Vercel)
1. Conecte o repositório ao Vercel
2. Configure `NEXT_PUBLIC_API_URL` com a URL do backend em produção
3. Deploy automático a cada push

### Backend (Azure)
1. Criar Azure App Service
2. Configurar connection string
3. Deploy via Git ou Azure DevOps

## 👨‍💻 Autor

**Helio Filho**
- .NET Backend Developer | ERP & Systems Integration
- LinkedIn: [heliofilhoo](https://www.linkedin.com/in/heliofilhoo/)
- GitHub: [heliofilho2](https://github.com/heliofilho2)
- Email: heliofilho.contato@outlook.com

## 📄 Licença

Este projeto é pessoal e serve como portfólio técnico.

---

**Desenvolvido com ❤️ usando Clean Architecture e SOLID Principles**
