# 🔍 Verificar se Variável Está Sendo Passada no Railway

## ⚠️ PROBLEMA

A variável `DATABASE_CONNECTION_STRING` está configurada no Railway, mas o backend ainda tenta conectar em `127.0.0.1:5432` (localhost).

---

## ✅ SOLUÇÃO: Verificar e Corrigir

### Passo 1: Verificar Variável no Railway

1. Acesse: https://railway.app/dashboard
2. Seu serviço → **Variables**
3. Verifique se existe `DATABASE_CONNECTION_STRING`
4. **Clique na variável** para ver o valor completo

**Verifique:**
- ✅ Nome exato: `DATABASE_CONNECTION_STRING` (sem espaços)
- ✅ Valor começa com `postgresql://`
- ✅ Sem espaços extras no início ou fim
- ✅ Senha correta

---

### Passo 2: Verificar Formato

**✅ CORRETO:**
```
postgresql://postgres.qnjrobyvhaoxcqhinsov:heliofilhodev@aws-1-us-east-2.pooler.supabase.com:5432/postgres
```

**❌ ERRADO:**
- Espaço no início: ` postgresql://...`
- Espaço no fim: `...postgres `
- Quebra de linha no meio
- Caracteres especiais estranhos

---

### Passo 3: Fazer Commit e Push da Correção

Já corrigi o código para priorizar a variável de ambiente. Faça commit e push:

```bash
cd backend
git add Portfolio.API/Program.cs
git commit -m "Priorizar variável de ambiente DATABASE_CONNECTION_STRING"
git push
```

O Railway fará deploy automaticamente.

---

### Passo 4: Verificar Logs Após Deploy

Após o deploy, verifique os logs do Railway:

1. Railway Dashboard → **Deployments** → Último deployment
2. Veja os logs

**Procure por:**
```
[DEBUG] Connection String lida: postgresql://postgres.qnjrobyvhaoxcqhinsov...
[DEBUG] Connection String começa com: postgresql://postgres
```

**Se aparecer:**
```
[DEBUG] Connection String está NULL ou vazia!
```

Ou se aparecer:
```
[DEBUG] Connection String lida: Host=localhost...
```

Significa que a variável **NÃO está sendo lida** pelo Railway.

---

### Passo 5: Se Variável Não Está Sendo Lida

#### Opção A: Recriar Variável

1. **Delete** a variável `DATABASE_CONNECTION_STRING`
2. **Aguarde 10 segundos**
3. **Adicione novamente:**
   - Name: `DATABASE_CONNECTION_STRING`
   - Value: `postgresql://postgres.qnjrobyvhaoxcqhinsov:heliofilhodev@aws-1-us-east-2.pooler.supabase.com:5432/postgres`
4. **Salve**
5. **Faça redeploy**

#### Opção B: Usar Formato Alternativo

Tente usar o formato `ConnectionStrings__DefaultConnection`:

1. Delete `DATABASE_CONNECTION_STRING`
2. Adicione:
   - Name: `ConnectionStrings__DefaultConnection`
   - Value: `postgresql://postgres.qnjrobyvhaoxcqhinsov:heliofilhodev@aws-1-us-east-2.pooler.supabase.com:5432/postgres`
3. Salve
4. Faça redeploy

**Nota:** O formato `ConnectionStrings__DefaultConnection` usa dois underscores (`__`) e é o formato padrão do .NET para connection strings.

---

### Passo 6: Verificar se Funcionou

Após o redeploy, teste:

```
https://portfolio-dev-production-d03e.up.railway.app/api/profile
```

**✅ SUCESSO:**
- Retorna JSON com dados do perfil
- Logs mostram `[DEBUG] Connection String lida: postgresql://...`
- Não aparece `127.0.0.1` ou `localhost` nos logs

**❌ ERRO:**
- Ainda retorna erro 500
- Logs ainda mostram `localhost` ou `127.0.0.1`
- Logs mostram `Connection String está NULL`

---

## 🔧 Debug Avançado

Se ainda não funcionar, adicione este código temporário no `Program.cs` para ver TODAS as variáveis de ambiente:

```csharp
// Debug: Listar todas as variáveis de ambiente
Console.WriteLine("[DEBUG] Variáveis de ambiente relacionadas a DB:");
var envVars = Environment.GetEnvironmentVariables();
foreach (var key in envVars.Keys)
{
    var keyStr = key.ToString();
    if (keyStr.Contains("DATABASE") || keyStr.Contains("CONNECTION") || keyStr.Contains("POSTGRES"))
    {
        Console.WriteLine($"[DEBUG] {keyStr} = {envVars[key]}");
    }
}
```

Isso mostrará nos logs quais variáveis o Railway está passando.

---

## 📋 Checklist

- [ ] Variável `DATABASE_CONNECTION_STRING` existe no Railway
- [ ] Nome exato (sem espaços)
- [ ] Valor correto (formato URI do Supabase)
- [ ] Sem espaços extras
- [ ] Commit e push feito (código corrigido)
- [ ] Redeploy feito
- [ ] Logs mostram `[DEBUG] Connection String lida: postgresql://...`
- [ ] Endpoint `/api/profile` retorna JSON

---

## 🆘 Se Ainda Não Funcionar

1. **Tente o formato alternativo** (`ConnectionStrings__DefaultConnection`)
2. **Verifique se há outras variáveis** com nomes similares que possam estar conflitando
3. **Delete e recrie** a variável do zero
4. **Verifique os logs** para ver o que o código está lendo

Envie:
- Screenshot da variável no Railway (com senha oculta)
- Últimas 30 linhas dos logs após o deploy
- O que aparece no `[DEBUG] Connection String lida:`
