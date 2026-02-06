# 🔧 Corrigir Railway + Vercel

## ⚠️ PROBLEMAS IDENTIFICADOS

### 1. Railway - Connection String com Erro
```
DATABASE_CONNECTION_STRING xHost=aws-1-us-east-2.pooler.supabase.com;...
```
**Problema:** Tem um `x` antes de `Host`! Deve ser apenas `Host=...`

### 2. Vercel - Variável Não Aplicada
A variável `NEXT_PUBLIC_API_URL` está configurada, mas o frontend ainda tenta acessar `localhost:5115`.
**Problema:** Precisa fazer **redeploy** no Vercel.

---

## ✅ SOLUÇÃO PASSO A PASSO

### PARTE 1: Corrigir Railway

#### 1.1 Acessar Railway Dashboard
1. Acesse: https://railway.app/dashboard
2. Selecione seu serviço (backend)
3. Vá em **Variables**

#### 1.2 Corrigir Connection String
1. **Delete** a variável `DATABASE_CONNECTION_STRING` (se existir com erro)
2. Clique em **+ New Variable**
3. Configure:

   **Name:**
   ```
   DATABASE_CONNECTION_STRING
   ```

   **Value:**
   ```
   Host=aws-1-us-east-2.pooler.supabase.com;Port=5432;Database=postgres;Username=postgres.qnjrobyvhaoxcqhinsov;Password=heliofilhodev;SSL Mode=Require;Trust Server Certificate=true
   ```

   ⚠️ **IMPORTANTE**: 
   - Deve começar com `Host=` (sem `x` antes!)
   - Se sua senha for diferente, substitua `heliofilhodev`

4. Clique em **Add**

#### 1.3 Fazer Redeploy no Railway
1. Vá em **Deployments**
2. Clique nos **3 pontinhos** (⋯) do último deployment
3. Clique em **Redeploy**
4. Aguarde completar (2-3 minutos)

#### 1.4 Testar Backend
Abra no navegador:
```
https://portfolio-dev-production-d03e.up.railway.app/api/profile
```

**✅ SUCESSO:** Retorna JSON com dados do perfil
```
{
  "id": 1,
  "name": "Helio Filho",
  ...
}
```

**❌ ERRO:** Ainda mostra erro (verifique os logs do Railway)

---

### PARTE 2: Corrigir Vercel

#### 2.1 Verificar Variável no Vercel
1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Verifique se existe:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://portfolio-dev-production-d03e.up.railway.app/api`
   - **Environments:** Production, Preview, Development

Se não existir ou estiver errada, adicione/corrija.

#### 2.2 Fazer Redeploy no Vercel
**⚠️ CRÍTICO**: Após configurar a variável, você **DEVE fazer redeploy**!

**Opção A: Redeploy Manual**
1. Vá em **Deployments**
2. Clique nos **3 pontinhos** (⋯) do último deployment
3. Clique em **Redeploy**
4. Aguarde completar (1-2 minutos)

**Opção B: Redeploy via Git**
1. Faça um pequeno commit (pode ser só um espaço em branco)
2. Faça push para o GitHub
3. O Vercel fará deploy automaticamente

#### 2.3 Verificar se Funcionou
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

## 📋 Checklist Completo

### Railway
- [ ] Variável `DATABASE_CONNECTION_STRING` existe
- [ ] Valor começa com `Host=` (sem `x` antes)
- [ ] Sem espaços extras no valor
- [ ] Senha correta do Supabase
- [ ] Redeploy feito após corrigir variável
- [ ] Endpoint `/api/profile` retorna JSON (não erro)

### Vercel
- [ ] Variável `NEXT_PUBLIC_API_URL` existe
- [ ] Valor é `https://portfolio-dev-production-d03e.up.railway.app/api`
- [ ] Variável marcada para Production, Preview e Development
- [ ] Redeploy feito após configurar variável
- [ ] Console do navegador mostra URL do Railway (não localhost)
- [ ] Dados aparecem no site

---

## 🆘 Se Ainda Não Funcionar

### Verificar Logs do Railway
1. Railway Dashboard → **Deployments** → Último deployment
2. Veja os logs
3. Procure por:
   - `Failed to connect to 127.0.0.1` → Connection string não está sendo lida
   - `Authentication failed` → Senha incorreta
   - `Host not found` → Hostname incorreto

### Verificar Connection String do Supabase
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **Database**
4. Role até **Connection string**
5. Escolha **Session mode** (não Direct connection)
6. Escolha **Parameters**
7. Copie a connection string e use no Railway

### Verificar Variável no Vercel
1. Vercel Dashboard → **Settings** → **Environment Variables**
2. Verifique se `NEXT_PUBLIC_API_URL` está correta
3. Se estiver, faça redeploy novamente

---

## 🎯 Ordem de Execução

1. ✅ Corrigir connection string no Railway
2. ✅ Fazer redeploy no Railway
3. ✅ Testar backend (`/api/profile` retorna JSON)
4. ✅ Verificar variável no Vercel
5. ✅ Fazer redeploy no Vercel
6. ✅ Testar frontend (dados aparecem no site)
