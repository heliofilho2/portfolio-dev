# 🔧 Troubleshooting - Portfolio não carrega dados

## Problema: Site não carrega informações do backend

### ✅ Checklist de Verificação

#### 1. **Variável de Ambiente no Vercel**

**O problema mais comum é a variável `NEXT_PUBLIC_API_URL` não estar configurada.**

**Como verificar:**
1. Acesse o [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Procure por `NEXT_PUBLIC_API_URL`

**Como configurar:**
1. No Vercel Dashboard, vá em **Settings** → **Environment Variables**
2. Clique em **Add New**
3. Configure:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://seu-backend.up.railway.app/api` (substitua pela URL do Railway)
   - **Environments**: Marque todas (Production, Preview, Development)
4. Clique em **Save**
5. **IMPORTANTE**: Faça um **redeploy** do projeto no Vercel

**⚠️ ATENÇÃO**: 
- A URL deve terminar com `/api` (ex: `https://portfolio-production.up.railway.app/api`)
- Após adicionar a variável, você **DEVE fazer redeploy** para ela ser aplicada

---

#### 2. **URL do Railway está correta?**

**Como verificar a URL do Railway:**
1. Acesse o [Railway Dashboard](https://railway.app/dashboard)
2. Selecione seu serviço (backend)
3. Vá em **Settings** → **Networking**
4. Procure por **Public Domain** ou clique em **Generate Domain**
5. Copie a URL (ex: `https://portfolio-production.up.railway.app`)

**Teste a URL manualmente:**
Abra no navegador: `https://seu-backend.up.railway.app/api/profile`

Se retornar JSON, está funcionando. Se der erro, veja a seção 4.

---

#### 3. **CORS está configurado?**

O backend já está configurado para aceitar qualquer origem (`AllowAnyOrigin()`), então CORS não deve ser o problema.

**Mas se ainda assim der erro de CORS:**
1. Verifique os logs do Railway
2. Confirme que o backend está usando a versão mais recente do código

---

#### 4. **Backend está rodando no Railway?**

**Como verificar:**
1. Acesse o Railway Dashboard
2. Vá na aba **Deployments**
3. Verifique se o último deployment foi bem-sucedido (verde)
4. Se estiver vermelho, clique para ver os logs de erro

**Erros comuns:**
- `dotnet: not found` → Use o Dockerfile (veja `RAILWAY-DEPLOY.md`)
- `Connection string not found` → Configure `DATABASE_CONNECTION_STRING` no Railway
- `Port already in use` → Railway gerencia isso automaticamente

---

#### 5. **Banco de dados está acessível?**

**Como verificar:**
1. No Railway, verifique se a variável `DATABASE_CONNECTION_STRING` está configurada
2. Teste a conexão via Swagger: `https://seu-backend.up.railway.app/swagger`
3. Tente fazer um GET em `/api/profile` via Swagger

**Se der erro 500:**
- Verifique os logs do Railway
- Pode ser problema de migração (tabelas não criadas)
- Execute as migrações manualmente no Supabase (veja `APPLY_MIGRATIONS.sql`)

---

#### 6. **Console do navegador mostra erros?**

**Como verificar:**
1. Abra o site no navegador
2. Pressione `F12` para abrir DevTools
3. Vá na aba **Console**
4. Procure por erros em vermelho

**Erros comuns e soluções:**

| Erro | Causa | Solução |
|------|-------|---------|
| `Failed to fetch` | CORS ou URL incorreta | Verificar variável `NEXT_PUBLIC_API_URL` |
| `404 Not Found` | Endpoint não existe | Verificar se backend está rodando |
| `500 Internal Server Error` | Erro no backend | Verificar logs do Railway |
| `Network error` | Backend offline | Verificar Railway Dashboard |

---

## 🔍 Debug Passo a Passo

### Passo 1: Verificar variável no Vercel
```bash
# No Vercel Dashboard:
Settings → Environment Variables → Verificar NEXT_PUBLIC_API_URL
```

### Passo 2: Verificar URL do Railway
```bash
# No Railway Dashboard:
Settings → Networking → Copiar Public Domain
```

### Passo 3: Testar backend diretamente
```bash
# Abrir no navegador:
https://seu-backend.up.railway.app/swagger
https://seu-backend.up.railway.app/api/profile
```

### Passo 4: Verificar logs do frontend
```bash
# No navegador (F12 → Console):
# Deve mostrar logs como:
[API] Fazendo requisição para: https://...
[API] API_BASE_URL configurada: https://...
```

### Passo 5: Verificar logs do backend
```bash
# No Railway Dashboard:
Deployments → Último deployment → Ver logs
```

---

## 🚨 Solução Rápida

Se nada funcionar, tente:

1. **Redeploy completo:**
   - Vercel: Settings → Deployments → Redeploy
   - Railway: Deployments → Redeploy

2. **Verificar variáveis de ambiente:**
   - Vercel: `NEXT_PUBLIC_API_URL = https://seu-backend.up.railway.app/api`
   - Railway: `DATABASE_CONNECTION_STRING = postgresql://...`

3. **Limpar cache:**
   - No navegador: `Ctrl+Shift+R` (hard refresh)
   - No Vercel: Redeploy

---

## 📞 Se ainda não funcionar

Envie:
1. Screenshot do Console do navegador (F12)
2. Screenshot das variáveis de ambiente do Vercel
3. Screenshot dos logs do Railway
4. URL do Railway que você está usando
