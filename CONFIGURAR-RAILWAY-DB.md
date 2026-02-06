# 🔧 Configurar Connection String no Railway

## ⚠️ ERRO ATUAL

```
Format of the initialization string does not conform to specification starting at index 0.
```

**Causa:** A variável de ambiente `DATABASE_CONNECTION_STRING` ou `ConnectionStrings__DefaultConnection` não está configurada no Railway.

---

## ✅ SOLUÇÃO: Adicionar Variável no Railway

### Passo 1: Acessar Railway Dashboard

1. Acesse: https://railway.app/dashboard
2. Faça login (se necessário)
3. Selecione seu projeto **portfolio-dev** (ou o nome que você deu)
4. Selecione o serviço do **backend**

---

### Passo 2: Ir para Variables

1. No menu lateral, clique em **Variables** (ou **Settings** → **Variables**)
2. Você verá uma lista de variáveis de ambiente (pode estar vazia)

---

### Passo 3: Adicionar Connection String

1. Clique em **+ New Variable** (ou **Add Variable**)
2. Preencha os campos:

   **Name:**
   ```
   DATABASE_CONNECTION_STRING
   ```

   **Value (Formato URI - Recomendado):**
   ```
   postgresql://postgres.qnjrobyvhaoxcqhinsov:SUA_SENHA@aws-1-us-east-2.pooler.supabase.com:5432/postgres
   ```

   **OU (Formato Parameters - Alternativo):**
   ```
   Host=aws-1-us-east-2.pooler.supabase.com;Port=5432;Database=postgres;Username=postgres.qnjrobyvhaoxcqhinsov;Password=SUA_SENHA;SSL Mode=Require;Trust Server Certificate=true
   ```

   ⚠️ **IMPORTANTE**: 
   - Use a connection string do **Supabase Session Pooler** (com `.pooler.supabase.com`)
   - Substitua `SUA_SENHA` pela senha real do seu Supabase
   - O formato URI é mais simples (copie direto do Supabase)
   - O formato Parameters é mais explícito (pode adicionar opções extras)

3. Clique em **Add** (ou **Save**)

---

### Passo 4: Verificar Formato da Connection String

O Npgsql aceita **AMBOS** os formatos:

**Formato URI (Recomendado - mais simples):**
```
postgresql://postgres.qnjrobyvhaoxcqhinsov:SUA_SENHA@aws-1-us-east-2.pooler.supabase.com:5432/postgres
```

**Formato Parameters (Alternativo - mais explícito):**
```
Host=aws-1-us-east-2.pooler.supabase.com;Port=5432;Database=postgres;Username=postgres.qnjrobyvhaoxcqhinsov;Password=SUA_SENHA;SSL Mode=Require;Trust Server Certificate=true
```

**💡 Dica:** Use o formato URI! É mais fácil - copie direto do Supabase e só substitua `[YOUR-PASSWORD]` pela sua senha.

---

### Passo 5: Fazer Redeploy

**⚠️ CRÍTICO**: Após adicionar a variável, você **DEVE fazer redeploy**!

1. Vá na aba **Deployments** (no menu superior)
2. Clique nos **3 pontinhos** (⋯) do último deployment
3. Clique em **Redeploy**
4. Aguarde o deploy completar

**OU:**

1. Faça um pequeno commit e push no Git
2. O Railway fará deploy automaticamente

---

## 🔍 Como Verificar se Funcionou

### 1. Verificar Logs do Railway

1. No Railway Dashboard, vá em **Deployments**
2. Clique no último deployment
3. Veja os logs - não deve aparecer erro de connection string

### 2. Testar Endpoint

Abra no navegador:
```
https://portfolio-dev-production-d03e.up.railway.app/api/profile
```

**✅ SUCESSO:** Retorna JSON com dados do perfil
```
{
  "id": 1,
  "name": "Helio Filho",
  "role": "...",
  ...
}
```

**❌ ERRO:** Ainda retorna erro (verifique os logs do Railway)

---

## 📋 Checklist Final

- [ ] Variável `DATABASE_CONNECTION_STRING` adicionada no Railway
- [ ] Connection string no formato correto (Parameters, não URI)
- [ ] Usando Session Pooler do Supabase (`.pooler.supabase.com`)
- [ ] Senha correta configurada
- [ ] Redeploy feito após adicionar variável
- [ ] Endpoint `/api/profile` retorna JSON (não erro)

---

## 🆘 Se Ainda Não Funcionar

### Verificar Connection String do Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **Database**
4. Role até **Connection string**
5. Escolha **Session pooler** (não Direct connection)
6. Escolha **URI** (recomendado - mais simples)
7. Copie a connection string
8. Substitua `[YOUR-PASSWORD]` pela sua senha real

**Formato URI (recomendado):**
```
postgresql://postgres.qnjrobyvhaoxcqhinsov:SUA_SENHA@aws-1-us-east-2.pooler.supabase.com:5432/postgres
```

**Formato Parameters (alternativo):**
```
Host=aws-1-us-east-2.pooler.supabase.com;Port=5432;Database=postgres;Username=postgres.qnjrobyvhaoxcqhinsov;Password=SUA_SENHA;SSL Mode=Require;Trust Server Certificate=true
```

### Verificar Logs do Railway

1. Railway Dashboard → Deployments → Último deployment
2. Veja os logs para erros específicos
3. Procure por mensagens como:
   - "Connection string not found"
   - "Format of the initialization string"
   - "Authentication failed"

---

## 💡 Dica: Duas Formas de Configurar

O código aceita duas formas:

1. **`DATABASE_CONNECTION_STRING`** (recomendado)
   ```
   DATABASE_CONNECTION_STRING = Host=...;Port=...;...
   ```

2. **`ConnectionStrings__DefaultConnection`** (formato .NET)
   ```
   ConnectionStrings__DefaultConnection = Host=...;Port=...;...
   ```

Use qualquer uma das duas. A primeira é mais simples.
