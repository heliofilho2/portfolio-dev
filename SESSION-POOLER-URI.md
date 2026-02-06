# 🔗 Usar Session Pooler URI no Railway

## ✅ Formato Correto (URI)

O Npgsql aceita o formato URI diretamente! É mais simples:

### No Railway Dashboard:

1. Acesse: https://railway.app/dashboard
2. Seu serviço → **Variables**
3. Adicione ou edite:

   **Name:**
   ```
   DATABASE_CONNECTION_STRING
   ```

   **Value:**
   ```
   postgresql://postgres.qnjrobyvhaoxcqhinsov:SUA_SENHA@aws-1-us-east-2.pooler.supabase.com:5432/postgres
   ```

   ⚠️ **Substitua `SUA_SENHA` pela senha real do Supabase!**

4. Salve
5. Faça **Redeploy**

---

## 📋 Como Pegar do Supabase

1. Acesse: https://supabase.com/dashboard
2. Seu projeto → **Settings** → **Database**
3. Role até **Connection string**
4. Escolha:
   - **Type:** `Session pooler`
   - **Source:** `IPv4 compatible`
   - **Method:** `URI`
5. Copie a connection string
6. Substitua `[YOUR-PASSWORD]` pela sua senha
7. Cole no Railway

---

## ✅ Exemplo Completo

**Do Supabase:**
```
postgresql://postgres.qnjrobyvhaoxcqhinsov:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:5432/postgres
```

**No Railway (após substituir senha):**
```
postgresql://postgres.qnjrobyvhaoxcqhinsov:heliofilhodev@aws-1-us-east-2.pooler.supabase.com:5432/postgres
```

---

## 🔍 Por que Session Pooler?

- ✅ **IPv4 compatible** - Funciona em qualquer rede
- ✅ **Gratuito** - Sem custos adicionais
- ✅ **Mais estável** - Gerencia conexões automaticamente
- ✅ **Recomendado pelo Supabase** para aplicações

---

## ⚠️ Importante

- Use **Session pooler**, não Direct connection
- Use **URI format**, não Parameters (mais simples)
- Substitua `[YOUR-PASSWORD]` pela senha real
- Faça **redeploy** após configurar

---

## 🧪 Testar

Após configurar e fazer redeploy:

```
https://portfolio-dev-production-d03e.up.railway.app/api/profile
```

Deve retornar JSON com dados do perfil! ✅
