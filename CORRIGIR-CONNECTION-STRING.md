# 🔧 Corrigir Connection String no Railway

## ⚠️ PROBLEMA IDENTIFICADO

O erro mostra:
```
Failed to connect to 127.0.0.1:5432
```

E você configurou:
```
DATABASE_CONNECTION_STRING xHost=aws-1-us-east-2.pooler.supabase.com;...
```

**Problema:** Tem um caractere `x` antes de `Host`! Deve ser apenas `Host=...`

---

## ✅ SOLUÇÃO: Corrigir no Railway

### Passo 1: Acessar Railway Dashboard

1. Acesse: https://railway.app/dashboard
2. Selecione seu serviço (backend)
3. Vá em **Variables** (ou **Settings** → **Variables**)

---

### Passo 2: Editar ou Recriar a Variável

**Opção A: Editar (se possível)**
1. Clique na variável `DATABASE_CONNECTION_STRING`
2. Edite o valor e remova o `x` antes de `Host`
3. Salve

**Opção B: Deletar e Recriar (recomendado)**
1. Delete a variável `DATABASE_CONNECTION_STRING` (se existir)
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
   - Sem espaços extras
   - Se sua senha for diferente, substitua `heliofilhodev`

4. Clique em **Add** (ou **Save**)

---

### Passo 3: Verificar Formato Correto

A connection string deve estar **EXATAMENTE** assim:

```
Host=aws-1-us-east-2.pooler.supabase.com;Port=5432;Database=postgres;Username=postgres.qnjrobyvhaoxcqhinsov;Password=heliofilhodev;SSL Mode=Require;Trust Server Certificate=true
```

**✅ CORRETO:**
- `Host=...` (sem `x` antes)
- `Port=5432` (sem espaços)
- `Database=postgres`
- `Username=postgres.qnjrobyvhaoxcqhinsov`
- `Password=heliofilhodev` (sua senha real)
- `SSL Mode=Require` (com espaço entre `SSL` e `Mode`)
- `Trust Server Certificate=true`

**❌ ERRADO:**
- `xHost=...` ❌
- `Host = ...` ❌ (espaço antes do `=`)
- `Port = 5432` ❌ (espaços)

---

### Passo 4: Fazer Redeploy no Railway

**⚠️ CRÍTICO**: Após corrigir a variável, você **DEVE fazer redeploy**!

1. Vá em **Deployments**
2. Clique nos **3 pontinhos** (⋯) do último deployment
3. Clique em **Redeploy**
4. Aguarde completar

---

### Passo 5: Testar

Abra no navegador:
```
https://portfolio-dev-production-d03e.up.railway.app/api/profile
```

**✅ SUCESSO:** Retorna JSON com dados do perfil

**❌ ERRO:** Ainda mostra erro (verifique os logs do Railway)

---

## 🔍 Verificar Logs do Railway

Se ainda não funcionar:

1. Railway Dashboard → **Deployments** → Último deployment
2. Veja os logs
3. Procure por:
   - `Failed to connect to 127.0.0.1` → Connection string não está sendo lida
   - `Authentication failed` → Senha incorreta
   - `Host not found` → Hostname incorreto

---

## 📋 Checklist

- [ ] Variável `DATABASE_CONNECTION_STRING` existe no Railway
- [ ] Valor começa com `Host=` (sem `x` antes)
- [ ] Sem espaços extras no valor
- [ ] Senha correta do Supabase
- [ ] Redeploy feito após corrigir variável
- [ ] Endpoint `/api/profile` retorna JSON (não erro)
