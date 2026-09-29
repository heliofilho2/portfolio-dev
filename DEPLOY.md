# 🚀 Guia de Deploy

## 🔒 Segurança da API

A API está protegida com **API Key** para endpoints de escrita (POST, PUT, DELETE). Endpoints de leitura (GET) continuam públicos para o frontend funcionar.

### Configuração da API Key

**1. Railway (Produção):**
- Vá em **Variables** do seu serviço
- Adicione: `API_KEY` = `seu-token-super-secreto-aqui`
- Use um token forte (ex: gerado com `openssl rand -hex 32`)

**2. Desenvolvimento Local:**
- Crie arquivo `backend/Portfolio.API/appsettings.Development.json`:
```json
{
  "API_KEY": "dev-key-local-only"
}
```
- Ou configure variável de ambiente: `$env:API_KEY="dev-key-local-only"` (PowerShell)

### Como Usar a API Key

**No Swagger (desenvolvimento local):**
1. Abra: `http://localhost:5115/swagger`
2. Clique no botão **Authorize** (🔒 no topo direito)
3. No campo **Value**, cole sua API Key (`<sua-api-key>`)
4. Clique em **Authorize**
5. Agora todos os endpoints POST/PUT/DELETE funcionarão

**No Postman/Thunder Client (local ou produção):**
1. Crie uma nova requisição (POST, PUT ou DELETE)
2. Vá na aba **Headers**
3. Adicione:
   - **Key**: `X-API-Key`
   - **Value**: `<sua-api-key>`
4. Faça a requisição normalmente

**Em Produção (Railway):**
1. Configure a mesma API Key no Railway (Settings → Variables → `API_KEY`)
2. Use o mesmo header `X-API-Key` em todas as requisições POST/PUT/DELETE
3. Exemplo com curl:
```bash
curl -X POST https://sua-url-railway.up.railway.app/api/projects \
  -H "Content-Type: application/json" \
  -H "X-API-Key: <sua-api-key>" \
  -d '{"title": "Novo Projeto", ...}'
```

**Endpoints Protegidos:**
- `POST /api/projects` - Criar projeto
- `PUT /api/projects/{id}` - Atualizar projeto
- `DELETE /api/projects/{id}` - Deletar projeto
- `POST /api/resume/en` - Upload resume EN
- `POST /api/resume/pt` - Upload resume PT
- Todos os outros POST/PUT/DELETE

**Endpoints Públicos (não precisam de API Key):**
- `GET /api/projects` - Listar projetos
- `GET /api/projects/{id}` - Buscar projeto
- `GET /api/profile` - Buscar perfil
- `GET /api/skills` - Listar skills
- `GET /api/experiences` - Listar experiências
- `GET /api/resume/en` - Download resume EN
- `GET /api/resume/pt` - Download resume PT

---

# 🚀 Guia de Deploy

## 📋 Pré-requisitos

- Conta no [GitHub](https://github.com)
- Conta no [Vercel](https://vercel.com) (gratuita)
- Conta no [Railway](https://railway.app) (gratuita)
- Conta no [Supabase](https://supabase.com) (gratuita)

## 🗄️ 1. Configurar Database (Supabase)

### 1.1. Criar Projeto no Supabase

1. Acesse: https://supabase.com
2. Faça login (pode usar GitHub)
3. Clique em **New Project**
4. Preencha:
   - **Name**: portfolio-db
   - **Database Password**: Crie uma senha forte (ANOTE!)
   - **Region**: Escolha mais próxima
5. Aguarde criação (2-3 minutos)

### 1.2. Obter Connection String

1. No projeto criado, vá em **Settings** → **Database**
2. Role até **Connection string**
3. Configure:
   - **Type**: `Session pooler`
   - **Source**: `IPv4 compatible`
   - **Method**: `URI`
4. Copie a connection string (formato: `postgresql://user:pass@host:5432/postgres`)

## 🔧 2. Deploy Backend (Railway)

### 2.1. Conectar Repositório

1. Acesse: https://railway.app/dashboard
2. Clique em **New Project**
3. Selecione **Deploy from GitHub repo**
4. Escolha o repositório `portfolio-dev`
5. Railway detectará automaticamente o Dockerfile

### 2.2. Configurar Serviço

1. No serviço criado, vá em **Settings** → **General**
   - **Root Directory**: `backend`

2. Vá em **Settings** → **Build**
   - **Builder**: `DOCKERFILE`
   - **Dockerfile Path**: `Dockerfile`

3. Vá em **Settings** → **Variables**
   - Adicione variáveis:
     - **Name**: `DATABASE_CONNECTION_STRING`
       - **Value**: Cole a connection string do Supabase (formato URI)
       - Substitua `[YOUR-PASSWORD]` pela senha real
     - **Name**: `API_KEY`
       - **Value**: Gere um token seguro (ex: use gerador online ou `openssl rand -hex 32`)
       - ⚠️ **IMPORTANTE**: Guarde este token! Você precisará dele para fazer POST/PUT/DELETE

4. Vá em **Settings** → **Networking**
   - Clique em **Generate Domain** (se não tiver)
   - Copie a URL pública (ex: `portfolio-dev-production-d03e.up.railway.app`)

### 2.3. Executar Migrations

Após o primeiro deploy, execute as migrations:

1. No Railway, vá em **Deployments**
2. Clique no deployment
3. Vá em **Shell** (ou use Railway CLI)
4. Execute:
```bash
cd Portfolio.Infrastructure
dotnet ef database update --startup-project ../Portfolio.API
```

**OU** execute localmente apontando para o Supabase:
```bash
cd backend/Portfolio.Infrastructure
dotnet ef database update --startup-project ../Portfolio.API
```

### 2.4. Testar Backend

Abra no navegador:
```
https://sua-url-railway.up.railway.app/swagger
```

Deve abrir o Swagger UI. Teste o endpoint `/api/profile`.

## 🎨 3. Deploy Frontend (Vercel)

### 3.1. Conectar Repositório

1. Acesse: https://vercel.com/dashboard
2. Clique em **Add New** → **Project**
3. Importe o repositório `portfolio-dev`
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (automático)
   - **Output Directory**: `.next` (automático)

### 3.2. Configurar Variáveis de Ambiente

1. No projeto, vá em **Settings** → **Environment Variables**
2. Adicione:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://sua-url-railway.up.railway.app/api` (sem barra no final!)
   - **Environments**: Production, Preview, Development
3. Salve

### 3.3. Deploy

1. Clique em **Deploy**
2. Aguarde o build completar (1-2 minutos)
3. Vercel gerará uma URL (ex: `portfolio-dev.vercel.app`)

### 3.4. Testar Frontend

Abra a URL do Vercel. O site deve carregar os dados do backend.

## ✅ 4. Verificação Final

### Backend
- [ ] Swagger **NÃO** abre em produção (segurança - apenas em dev)
- [ ] Endpoint `/api/profile` retorna JSON (GET público)
- [ ] Endpoint `/api/projects` retorna array (GET público)
- [ ] Endpoint `/api/skills` retorna array (GET público)
- [ ] Endpoint `/api/experiences` retorna array (GET público)
- [ ] POST/PUT/DELETE retornam 401 sem API Key (proteção funcionando)
- [ ] POST/PUT/DELETE funcionam com header `X-API-Key` correto

### Frontend
- [ ] Site carrega sem erros
- [ ] Dados aparecem (profile, projects, skills, experiences)
- [ ] Dark/Light mode funciona
- [ ] Navegação funciona
- [ ] Página About funciona

### Console do Navegador
- [ ] Não há erros de CORS
- [ ] Não há erros 404
- [ ] Logs mostram URL do Railway (não localhost)

## 🔄 5. Atualizações Futuras

### Backend
- Faça alterações no código
- Commit e push para `main`
- Railway fará deploy automático

### Frontend
- Faça alterações no código
- Commit e push para `main`
- Vercel fará deploy automático

## 🆘 Troubleshooting

### Backend não conecta ao banco
- Verifique `DATABASE_CONNECTION_STRING` no Railway
- Use formato URI do Supabase Session Pooler
- Verifique logs do Railway

### Frontend não carrega dados
- Verifique `NEXT_PUBLIC_API_URL` no Vercel
- URL deve terminar com `/api` (sem barra no final)
- Faça redeploy após alterar variável

### Erro 404 nos endpoints
- Verifique se migrations foram executadas
- Verifique se há dados no banco
- Verifique logs do Railway

---

**Pronto! Seu portfólio está no ar! 🎉**
