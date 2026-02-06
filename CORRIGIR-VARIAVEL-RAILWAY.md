# 🔧 Corrigir Variável DATABASE_CONNECTION_STRING no Railway

## ⚠️ PROBLEMA IDENTIFICADO

O erro mostra:
```
Failed to connect to 127.0.0.1:5432
database 'portfolio' on server 'tcp://localhost:5432'
```

**Isso significa:** A variável `DATABASE_CONNECTION_STRING` **NÃO está sendo lida** pelo Railway. O backend está usando os valores padrão do `appsettings.json` (localhost).

---

## ✅ SOLUÇÃO: Verificar e Corrigir Variável no Railway

### Passo 1: Acessar Railway Dashboard

1. Acesse: https://railway.app/dashboard
2. Selecione seu serviço (backend)
3. Vá em **Variables** (ou **Settings** → **Variables**)

---

### Passo 2: Verificar se a Variável Existe

**Verifique se existe:**
- `DATABASE_CONNECTION_STRING`

**Se NÃO existir:**
- Adicione agora (veja Passo 3)

**Se existir:**
- Verifique o formato (veja Passo 4)
- Pode estar com erro de digitação ou formato incorreto

---

### Passo 3: Adicionar Variável (se não existir)

1. Clique em **+ New Variable** (ou **Add Variable**)
2. Configure:

   **Name:**
   ```
   DATABASE_CONNECTION_STRING
   ```
   ⚠️ **EXATAMENTE assim, sem espaços, sem caracteres extras!**

   **Value (Formato URI - Recomendado):**
   ```
   postgresql://postgres.qnjrobyvhaoxcqhinsov:SUA_SENHA@aws-1-us-east-2.pooler.supabase.com:5432/postgres
   ```

   **OU (Formato Parameters - Alternativo):**
   ```
   Host=aws-1-us-east-2.pooler.supabase.com;Port=5432;Database=postgres;Username=postgres.qnjrobyvhaoxcqhinsov;Password=SUA_SENHA;SSL Mode=Require;Trust Server Certificate=true
   ```

   ⚠️ **IMPORTANTE:**
   - Substitua `SUA_SENHA` pela senha real do Supabase
   - Sem espaços extras no início ou fim
   - Sem caracteres estranhos

3. Clique em **Add** (ou **Save**)

---

### Passo 4: Verificar Formato da Variável Existente

Se a variável já existe, verifique:

**✅ CORRETO:**
- Name: `DATABASE_CONNECTION_STRING` (exatamente assim)
- Value começa com `postgresql://` (URI) OU `Host=` (Parameters)
- Sem espaços extras
- Senha correta

**❌ ERRADO:**
- Name: `DATABASE_CONNECTION_STRING ` (espaço no final)
- Name: `database_connection_string` (minúsculas)
- Value: `xHost=...` (caractere extra)
- Value: ` Host=...` (espaço no início)
- Value com `localhost` ou `127.0.0.1`

---

### Passo 5: Copiar Connection String do Supabase

1. Acesse: https://supabase.com/dashboard
2. Seu projeto → **Settings** → **Database**
3. Role até **Connection string**
4. Configure:
   - **Type:** `Session pooler`
   - **Source:** `IPv4 compatible`
   - **Method:** `URI`
5. Copie a connection string
6. Substitua `[YOUR-PASSWORD]` pela sua senha real
7. Cole no Railway (substitua o valor existente)

**Exemplo do Supabase:**
```
postgresql://postgres.qnjrobyvhaoxcqhinsov:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:5432/postgres
```

**No Railway (após substituir):**
```
postgresql://postgres.qnjrobyvhaoxcqhinsov:heliofilhodev@aws-1-us-east-2.pooler.supabase.com:5432/postgres
```

---

### Passo 6: Fazer Redeploy

**⚠️ CRÍTICO**: Após adicionar/corrigir a variável, você **DEVE fazer redeploy**!

1. Vá em **Deployments**
2. Clique nos **3 pontinhos** (⋯) do último deployment
3. Clique em **Redeploy**
4. Aguarde completar (2-3 minutos)

---

### Passo 7: Verificar Logs Após Redeploy

Após o redeploy, verifique os logs:

1. Railway Dashboard → **Deployments** → Último deployment
2. Veja os logs

**✅ SUCESSO:**
- Não deve aparecer `Failed to connect to 127.0.0.1`
- Não deve aparecer `database 'portfolio'`
- Deve aparecer mensagens de inicialização normais

**❌ ERRO:**
- Se ainda aparecer `127.0.0.1` ou `localhost`, a variável não está sendo lida
- Verifique o nome da variável novamente
- Verifique se não tem espaços ou caracteres extras

---

## 🔍 Debug: Verificar se Variável Está Sendo Lida

Para confirmar que a variável está sendo lida, você pode adicionar um log temporário no `Program.cs`:

```csharp
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? Environment.GetEnvironmentVariable("DATABASE_CONNECTION_STRING")
    ?? throw new InvalidOperationException(
        "Connection string 'DefaultConnection' not found. " +
        "Configure em appsettings.json ou variável de ambiente DATABASE_CONNECTION_STRING.");

// Log temporário para debug (remover depois)
Console.WriteLine($"[DEBUG] Connection String: {connectionString?.Substring(0, Math.Min(50, connectionString?.Length ?? 0))}...");
```

Isso mostrará nos logs se a connection string está sendo lida corretamente.

---

## 📋 Checklist Final

- [ ] Variável `DATABASE_CONNECTION_STRING` existe no Railway
- [ ] Nome da variável está exatamente correto (sem espaços)
- [ ] Valor começa com `postgresql://` (URI) OU `Host=` (Parameters)
- [ ] Sem espaços extras no valor
- [ ] Senha correta do Supabase
- [ ] Usando Session Pooler (`.pooler.supabase.com`)
- [ ] Redeploy feito após configurar variável
- [ ] Logs não mostram `127.0.0.1` ou `localhost`
- [ ] Endpoint `/api/profile` retorna JSON (não erro)

---

## 🆘 Se Ainda Não Funcionar

1. **Delete a variável** e **recrie** do zero
2. **Copie a connection string diretamente do Supabase** (não digite manualmente)
3. **Verifique se não tem espaços** antes ou depois do valor
4. **Faça redeploy** novamente
5. **Verifique os logs** para ver se ainda tenta conectar em `127.0.0.1`

Se ainda assim não funcionar, envie:
- Screenshot da variável no Railway (com senha oculta)
- Últimas 20 linhas dos logs após o redeploy
