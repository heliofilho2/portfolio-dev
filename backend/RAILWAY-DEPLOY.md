# 🚂 Guia de Deploy no Railway

## ✅ Configurações Necessárias

### 1. No Railway Dashboard

#### Source
- **Source Repo**: `heliofilho2/portfolio-dev`
- **Branch**: `main`

#### Settings → General
- **Root Directory**: `backend`

#### Settings → Build
- **Builder**: `NIXPACKS` (não Metal)
- **Build Command**: (deixar vazio - o `railway.json` gerencia)
- Ou manualmente: `dotnet publish Portfolio.API/Portfolio.API.csproj -c Release -o /app/publish`

#### Settings → Deploy
- **Start Command**: (deixar vazio - o `railway.json` gerencia)
- Ou manualmente: `cd /app/publish && dotnet Portfolio.API.dll --urls http://0.0.0.0:$PORT`

#### Settings → Variables
Adicione a variável de ambiente:

```
ConnectionStrings__DefaultConnection = Host=aws-1-us-east-2.pooler.supabase.com;Port=5432;Database=postgres;Username=postgres.qnjrobyvhaoxcqhinsov;Password=heliofilhodev;SSL Mode=Require;Trust Server Certificate=true
```

**OU** (formato alternativo):

```
DATABASE_CONNECTION_STRING = Host=aws-1-us-east-2.pooler.supabase.com;Port=5432;Database=postgres;Username=postgres.qnjrobyvhaoxcqhinsov;Password=heliofilhodev;SSL Mode=Require;Trust Server Certificate=true
```

#### Networking
- **Public Networking**: ✅ Habilitado

#### Healthcheck (Opcional)
- **Healthcheck Path**: `/api/profile`

---

## 📋 Checklist de Deploy

- [ ] Root Directory configurado como `backend`
- [ ] Builder: `NIXPACKS`
- [ ] Variável `ConnectionStrings__DefaultConnection` adicionada
- [ ] Public Networking habilitado
- [ ] Arquivo `railway.json` commitado no Git
- [ ] Push feito para `main` branch

---

## 🔍 Verificação

Após o deploy:

1. **Verificar URL do Railway:**
   - No Railway Dashboard → Settings → Networking
   - Copie a URL pública (ex: `https://portfolio-production.up.railway.app`)

2. **Testar API:**
   - Acesse: `https://sua-url-railway.up.railway.app/api/profile`
   - Deve retornar JSON com o perfil

3. **Configurar no Vercel:**
   - Vá em Settings → Environment Variables
   - Adicione: `NEXT_PUBLIC_API_URL` = `https://sua-url-railway.up.railway.app/api`
   - Faça redeploy

---

## 🐛 Troubleshooting

### Erro: "dotnet: not found"
- **Solução**: Configure Builder como `NIXPACKS` (não Metal)
- Ou adicione `railway.json` na pasta `backend/`

### Erro: "Connection string not found"
- **Solução**: Verifique se a variável `ConnectionStrings__DefaultConnection` está configurada
- Formato: `ConnectionStrings__DefaultConnection` (com dois underscores)

### Erro: "Port already in use"
- **Solução**: O código já está configurado para usar `$PORT` do Railway
- Verifique se o `Program.cs` está usando `Environment.GetEnvironmentVariable("PORT")`

### CORS ainda bloqueando
- **Solução**: O código agora permite qualquer origem (`AllowAnyOrigin`)
- Se quiser restringir, configure `AllowedOrigins` via variável de ambiente

---

## 📝 Notas

- O Railway detecta automaticamente .NET se o `railway.json` estiver presente
- A porta é gerenciada automaticamente via variável `PORT`
- HTTPS é gerenciado pelo Railway (não precisa configurar)
- O arquivo `railway.json` está na pasta `backend/` e será detectado automaticamente

---

**Pronto para deploy! 🚀**
