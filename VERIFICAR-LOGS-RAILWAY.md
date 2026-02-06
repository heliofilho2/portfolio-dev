# 🔍 Verificar Logs do Railway para Diagnosticar Erro

## ⚠️ Erro Atual

```
{"message":"Internal server error","error":"An exception has been raised that is likely due to a transient failure."}
```

Este erro geralmente indica problema de conexão com o banco de dados.

---

## ✅ Passo 1: Verificar Logs do Railway

### 1.1 Acessar Logs

1. Acesse: https://railway.app/dashboard
2. Selecione seu serviço (backend)
3. Vá na aba **Deployments**
4. Clique no último deployment (o mais recente)
5. Veja os logs em tempo real

### 1.2 O que Procurar nos Logs

Procure por mensagens como:

**❌ Connection String não encontrada:**
```
Connection string 'DefaultConnection' not found
```

**❌ Erro de conexão:**
```
Failed to connect to 127.0.0.1:5432
Failed to connect to aws-1-us-east-2.pooler.supabase.com:5432
```

**❌ Autenticação falhou:**
```
Authentication failed for user
password authentication failed
```

**❌ Host não encontrado:**
```
Name or service not known
Could not resolve host
```

**❌ SSL/TLS:**
```
SSL connection required
certificate verify failed
```

---

## ✅ Passo 2: Verificar Variável de Ambiente

### 2.1 Verificar se Existe

1. Railway Dashboard → Seu serviço → **Variables**
2. Verifique se existe `DATABASE_CONNECTION_STRING`
3. Se não existir, adicione (veja `SESSION-POOLER-URI.md`)

### 2.2 Verificar Formato

A connection string deve estar assim:

**Formato URI (recomendado):**
```
postgresql://postgres.qnjrobyvhaoxcqhinsov:SUA_SENHA@aws-1-us-east-2.pooler.supabase.com:5432/postgres
```

**OU Formato Parameters:**
```
Host=aws-1-us-east-2.pooler.supabase.com;Port=5432;Database=postgres;Username=postgres.qnjrobyvhaoxcqhinsov;Password=SUA_SENHA;SSL Mode=Require;Trust Server Certificate=true
```

**⚠️ IMPORTANTE:**
- Sem espaços extras
- Sem caracteres estranhos (como `x` antes de `Host`)
- Senha correta do Supabase
- Usando Session Pooler (`.pooler.supabase.com`)

---

## ✅ Passo 3: Testar Connection String

### 3.1 Copiar Connection String do Supabase

1. Acesse: https://supabase.com/dashboard
2. Seu projeto → **Settings** → **Database**
3. Role até **Connection string**
4. Escolha:
   - **Type:** `Session pooler`
   - **Source:** `IPv4 compatible`
   - **Method:** `URI`
5. Copie a connection string
6. Substitua `[YOUR-PASSWORD]` pela sua senha real

### 3.2 Atualizar no Railway

1. Railway Dashboard → Seu serviço → **Variables**
2. Edite `DATABASE_CONNECTION_STRING`
3. Cole a connection string completa (com senha substituída)
4. Salve
5. Faça **Redeploy**

---

## ✅ Passo 4: Verificar Senha do Supabase

### 4.1 Verificar se a Senha Está Correta

A senha deve ser a mesma que você configurou ao criar o projeto no Supabase.

**Se não lembrar:**
1. Supabase Dashboard → **Settings** → **Database**
2. Role até **Database password**
3. Se não aparecer, você precisa resetar (isso pode afetar conexões existentes)

### 4.2 Testar Connection String Localmente (Opcional)

Se quiser testar antes de colocar no Railway:

```bash
# No PowerShell (Windows)
$env:DATABASE_CONNECTION_STRING="postgresql://postgres.qnjrobyvhaoxcqhinsov:SUA_SENHA@aws-1-us-east-2.pooler.supabase.com:5432/postgres"
cd backend/Portfolio.API
dotnet run
```

Se conectar localmente, a connection string está correta.

---

## ✅ Passo 5: Verificar Porta do Railway

O Railway pode estar usando uma porta diferente. Verifique:

1. Railway Dashboard → Seu serviço → **Settings** → **Networking**
2. Veja qual porta está configurada (geralmente 8080 ou automática)
3. O código já está configurado para usar `$PORT` do Railway

---

## 🔧 Soluções Comuns

### Problema: Connection String não encontrada

**Solução:**
1. Adicione `DATABASE_CONNECTION_STRING` no Railway
2. Faça redeploy

### Problema: Failed to connect to 127.0.0.1

**Solução:**
- A connection string não está sendo lida
- Verifique se o nome da variável está correto: `DATABASE_CONNECTION_STRING`
- Verifique se não tem espaços ou caracteres estranhos

### Problema: Authentication failed

**Solução:**
- Senha incorreta
- Verifique a senha no Supabase
- Use a connection string do Session Pooler (não Direct)

### Problema: Host not found

**Solução:**
- Hostname incorreto
- Use `aws-1-us-east-2.pooler.supabase.com` (Session Pooler)
- Não use `db.xxxxx.supabase.co` (Direct connection)

---

## 📋 Checklist de Diagnóstico

- [ ] Logs do Railway verificados
- [ ] Variável `DATABASE_CONNECTION_STRING` existe
- [ ] Connection string no formato correto (URI ou Parameters)
- [ ] Senha correta do Supabase
- [ ] Usando Session Pooler (`.pooler.supabase.com`)
- [ ] Sem espaços ou caracteres estranhos
- [ ] Redeploy feito após configurar variável
- [ ] Testado endpoint `/api/profile`

---

## 🆘 Se Ainda Não Funcionar

Envie:
1. Screenshot dos logs do Railway (últimas 50 linhas)
2. Screenshot da variável `DATABASE_CONNECTION_STRING` (com senha oculta)
3. Mensagem de erro completa do endpoint

Isso ajudará a identificar o problema específico.
