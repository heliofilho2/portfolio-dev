# 🚀 Como Configurar Variável de Ambiente no Vercel

## ⚠️ PROBLEMA ATUAL

O frontend está tentando acessar `http://localhost:5115/api`, o que significa que a variável `NEXT_PUBLIC_API_URL` **NÃO está configurada** no Vercel.

## ✅ SOLUÇÃO: Configurar Variável no Vercel

### Passo 1: Acessar o Vercel Dashboard

1. Acesse: https://vercel.com/dashboard
2. Faça login (se necessário)
3. Selecione seu projeto **portfolio-dev** (ou o nome que você deu)

---

### Passo 2: Ir para Environment Variables

1. No menu lateral, clique em **Settings**
2. No submenu, clique em **Environment Variables**

---

### Passo 3: Adicionar a Variável

1. Clique no botão **Add New** (ou **Add**)
2. Preencha os campos:

   **Name:**
   ```
   NEXT_PUBLIC_API_URL
   ```

   **Value:**
   ```
   https://portfolio-dev-production-d03e.up.railway.app/api
   ```
   ⚠️ **IMPORTANTE**: Substitua pela URL do seu Railway! A URL deve terminar com `/api`

   **Environments:**
   - ✅ Marque **Production**
   - ✅ Marque **Preview**
   - ✅ Marque **Development**

3. Clique em **Save**

---

### Passo 4: Fazer Redeploy

**⚠️ CRÍTICO**: Após adicionar a variável, você **DEVE fazer redeploy**!

1. Vá na aba **Deployments** (no menu superior)
2. Clique nos **3 pontinhos** (⋯) do último deployment
3. Clique em **Redeploy**
4. Confirme o redeploy

**OU:**

1. Vá em **Settings** → **Git**
2. Faça um pequeno commit e push (pode ser só um espaço em branco)
3. O Vercel fará deploy automaticamente

---

## 🔍 Como Verificar se Funcionou

### 1. Verificar no Console do Navegador

1. Abra seu site no Vercel
2. Pressione `F12` (DevTools)
3. Vá na aba **Console**
4. Procure por logs como:

   ✅ **CORRETO:**
   ```
   [API] Fazendo requisição para: https://portfolio-dev-production-d03e.up.railway.app/api/profile
   [API] API_BASE_URL configurada: https://portfolio-dev-production-d03e.up.railway.app/api
   ```

   ❌ **ERRADO (ainda não configurado):**
   ```
   [API] Fazendo requisição para: http://localhost:5115/api/profile
   [API] API_BASE_URL configurada: http://localhost:5115/api
   ```

### 2. Verificar se os Dados Carregam

- O site deve mostrar:
  - ✅ Nome e role no header
  - ✅ Projetos na seção Projects
  - ✅ Skills na seção Skills
  - ✅ Experiências na seção Experience
  - ✅ Informações no About

---

## 📋 Checklist Final

- [ ] Variável `NEXT_PUBLIC_API_URL` adicionada no Vercel
- [ ] Valor da variável termina com `/api`
- [ ] Variável marcada para Production, Preview e Development
- [ ] Redeploy feito após adicionar a variável
- [ ] Console do navegador mostra URL do Railway (não localhost)
- [ ] Dados aparecem no site

---

## 🆘 Se Ainda Não Funcionar

### Verificar URL do Railway

1. Acesse: https://railway.app/dashboard
2. Selecione seu serviço (backend)
3. Vá em **Settings** → **Networking**
4. Copie a **Public Domain** (ex: `portfolio-dev-production-d03e.up.railway.app`)
5. Use essa URL na variável do Vercel: `https://SUA-URL-DO-RAILWAY.up.railway.app/api`

### Testar Backend Diretamente

Abra no navegador:
```
https://portfolio-dev-production-d03e.up.railway.app/api/profile
```

Se retornar JSON, o backend está funcionando. Se der erro, veja os logs do Railway.

---

## 💡 Dica

**Por que a variável precisa terminar com `/api`?**

- O backend tem os controllers em `/api/profile`, `/api/projects`, etc.
- O frontend faz requisições para `/profile`, `/projects`, etc.
- Então a URL completa fica: `https://backend.com/api` + `/profile` = `https://backend.com/api/profile`
