# 🚀 Guia de Setup Git e Deploy Vercel

## 📋 Passo a Passo

### 1. ✅ Verificar .gitignore

O `.gitignore` já está configurado e ignora:
- `appsettings.Development.json` (contém secrets)
- `node_modules/`
- `bin/`, `obj/` (build artifacts)
- `.env` files

### 2. 🔧 Inicializar Git

```bash
# Na raiz do projeto
git init
git add .
git commit -m "Initial commit: Portfolio full-stack com Next.js e .NET 8"
```

### 3. 📦 Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Nome do repositório: `portfolio-dev` (ou o nome que preferir)
3. **NÃO** marque "Initialize with README" (já temos)
4. Clique em "Create repository"

### 4. 🔗 Conectar ao GitHub

```bash
# Adicionar remote (substitua SEU_USUARIO pelo seu username do GitHub)
git remote add origin https://github.com/SEU_USUARIO/portfolio-dev.git

# Ou se preferir SSH:
# git remote add origin git@github.com:SEU_USUARIO/portfolio-dev.git

# Verificar
git remote -v
```

### 5. 📤 Fazer Push

```bash
# Renomear branch principal (se necessário)
git branch -M main

# Fazer push
git push -u origin main
```

### 6. 🌐 Conectar ao Vercel

#### Opção A: Via Interface Web (Recomendado)

1. Acesse: https://vercel.com
2. Faça login com GitHub
3. Clique em "Add New Project"
4. Selecione o repositório `portfolio-dev`
5. Configure:
   - **Framework Preset**: Next.js (detecta automaticamente)
   - **Root Directory**: `frontend` (IMPORTANTE!)
   - **Build Command**: `npm run build` (ou deixar padrão)
   - **Output Directory**: `.next` (ou deixar padrão)
6. **Variáveis de Ambiente**:
   - Adicione: `NEXT_PUBLIC_API_URL`
   - Valor: URL do seu backend (ex: `http://localhost:5115` para testar, depois trocar para produção)
7. Clique em "Deploy"

#### Opção B: Via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Na pasta frontend
cd frontend
vercel

# Seguir as instruções interativas
```

### 7. ⚙️ Configurar Variáveis de Ambiente no Vercel

Após o deploy inicial:

1. Vá em: **Settings** → **Environment Variables**
2. Adicione:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: URL do backend em produção (ex: `https://seu-backend.azurewebsites.net`)
   - **Environments**: Production, Preview, Development
3. Salve e faça redeploy

### 8. 🔄 Deploy Automático

A partir de agora, **cada push para `main`** faz deploy automático no Vercel!

```bash
# Fazer mudanças
git add .
git commit -m "feat: adiciona nova feature"
git push origin main

# Vercel faz deploy automaticamente! 🎉
```

---

## 🎯 Checklist Final

- [ ] Git inicializado
- [ ] Commit inicial feito
- [ ] Repositório criado no GitHub
- [ ] Remote adicionado
- [ ] Push feito para GitHub
- [ ] Projeto conectado ao Vercel
- [ ] Variável `NEXT_PUBLIC_API_URL` configurada
- [ ] Deploy funcionando

---

## ⚠️ IMPORTANTE

### Secrets NUNCA no Git

✅ **PODE commitar:**
- `appsettings.json` (sem secrets)
- `appsettings.Development.json.example` (template)
- `.env.example` (template)

❌ **NÃO commitar:**
- `appsettings.Development.json` (com connection string real)
- `.env.local` (com secrets)
- Qualquer arquivo com senhas/tokens

### Verificar antes de commitar

```bash
# Ver o que será commitado
git status

# Ver diferenças
git diff
```

---

## 🐛 Troubleshooting

### Erro: "Repository not found"
- Verifique se o nome do repositório está correto
- Verifique se você tem permissão no repositório

### Erro: "Authentication failed"
- Use Personal Access Token (GitHub Settings → Developer settings → Personal access tokens)
- Ou configure SSH keys

### Vercel não detecta Next.js
- Verifique se o **Root Directory** está como `frontend`
- Verifique se `package.json` está na pasta `frontend`

### Build falha no Vercel
- Verifique os logs no Vercel Dashboard
- Verifique se todas as dependências estão no `package.json`
- Verifique se `NEXT_PUBLIC_API_URL` está configurada

---

## 📚 Próximos Passos

Depois do deploy do frontend:
1. Deploy do backend (Azure App Service)
2. Atualizar `NEXT_PUBLIC_API_URL` no Vercel
3. Configurar domínio personalizado
4. SEO avançado (Open Graph, sitemap)

---

**Pronto para deploy! 🚀**
