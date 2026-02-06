# 🚀 Configurar Vercel - Solução Final

## ⚠️ PROBLEMA

O frontend está tentando acessar `http://localhost:5115/api/profile` em vez da URL do Railway.

**Causa:** A variável `NEXT_PUBLIC_API_URL` não está configurada no Vercel ou não foi aplicada após o deploy.

---

## ✅ SOLUÇÃO: Configurar Variável no Vercel

### Passo 1: Acessar Vercel Dashboard

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto **portfolio-dev** (ou o nome que você deu)
3. Vá em **Settings** → **Environment Variables**

---

### Passo 2: Adicionar Variável

1. Clique em **Add New** (ou **Add**)
2. Configure:

   **Name:**
   ```
   NEXT_PUBLIC_API_URL
   ```

   **Value:**
   ```
   https://portfolio-dev-production-d03e.up.railway.app/api
   ```
   ⚠️ **IMPORTANTE**: 
   - Deve terminar com `/api`
   - Use `https://` (não `http://`)
   - Use a URL do Railway (não localhost)

   **Environments:**
   - ✅ Marque **Production**
   - ✅ Marque **Preview**
   - ✅ Marque **Development**

3. Clique em **Save**

---

### Passo 3: Fazer Redeploy

**⚠️ CRÍTICO**: Após adicionar a variável, você **DEVE fazer redeploy**!

**Opção A: Redeploy Manual**
1. Vá em **Deployments**
2. Clique nos **3 pontinhos** (⋯) do último deployment
3. Clique em **Redeploy**
4. Aguarde completar (1-2 minutos)

**Opção B: Redeploy via Git**
1. Faça um pequeno commit (pode ser só um espaço em branco)
2. Faça push para o GitHub
3. O Vercel fará deploy automaticamente

---

### Passo 4: Verificar se Funcionou

Após o redeploy:

1. Abra o site no Vercel
2. Pressione `F12` (DevTools)
3. Vá na aba **Console**
4. Procure por:

   **✅ CORRETO:**
   ```
   [API] Fazendo requisição para: https://portfolio-dev-production-d03e.up.railway.app/api/profile
   [API] API_BASE_URL configurada: https://portfolio-dev-production-d03e.up.railway.app/api
   ```

   **❌ ERRADO (ainda não aplicado):**
   ```
   [API] Fazendo requisição para: http://localhost:5115/api/profile
   [API] API_BASE_URL configurada: http://localhost:5115/api
   ```

Se ainda aparecer `localhost:5115`, faça redeploy novamente.

---

## 🔍 Verificar Variável no Código

O código do frontend está em `frontend/lib/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5115/api';
```

Se `NEXT_PUBLIC_API_URL` não estiver definida, usa `localhost:5115` como fallback.

---

## 📋 Checklist

- [ ] Variável `NEXT_PUBLIC_API_URL` adicionada no Vercel
- [ ] Valor é `https://portfolio-dev-production-d03e.up.railway.app/api`
- [ ] Variável marcada para Production, Preview e Development
- [ ] Redeploy feito após configurar variável
- [ ] Console do navegador mostra URL do Railway (não localhost)
- [ ] Dados aparecem no site

---

## 🆘 Se Ainda Não Funcionar

### Verificar URL do Railway

1. Acesse: https://railway.app/dashboard
2. Seu serviço → **Settings** → **Networking**
3. Copie a **Public Domain** (ex: `portfolio-dev-production-d03e.up.railway.app`)
4. Use essa URL na variável do Vercel: `https://SUA-URL-DO-RAILWAY.up.railway.app/api`

### Verificar Variável no Vercel

1. Vercel Dashboard → **Settings** → **Environment Variables**
2. Verifique se `NEXT_PUBLIC_API_URL` está correta
3. Se estiver, faça redeploy novamente

### Limpar Cache do Navegador

1. Pressione `Ctrl+Shift+R` (hard refresh)
2. Ou limpe o cache do navegador
3. Teste novamente

---

## 💡 Dica

**Por que a variável precisa terminar com `/api`?**

- O backend tem os controllers em `/api/profile`, `/api/projects`, etc.
- O frontend faz requisições para `/profile`, `/projects`, etc.
- Então a URL completa fica: `https://backend.com/api` + `/profile` = `https://backend.com/api/profile`

---

## 🎯 Próximos Passos

1. ✅ Configure `NEXT_PUBLIC_API_URL` no Vercel
2. ✅ Faça redeploy
3. ✅ Verifique o console do navegador
4. ✅ Teste o site

Após isso, o site deve carregar os dados do backend! 🚀
