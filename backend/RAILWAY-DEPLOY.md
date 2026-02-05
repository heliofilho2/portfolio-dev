# 🚂 Guia de Deploy no Railway

## ✅ Configurações Necessárias

### 1. No Railway Dashboard

#### Source
- **Source Repo**: `heliofilho2/portfolio-dev`
- **Branch**: `main`

#### Settings → General
- **Root Directory**: `backend`

#### Settings → Build
- **Builder**: `DOCKERFILE` (recomendado) ou `NIXPACKS`
  - **DOCKERFILE**: Usa o `Dockerfile` na pasta `backend/` (mais confiável)
  - **NIXPACKS**: Usa o `nixpacks.toml` (pode não funcionar em alguns casos)
- **Build Command**: (deixar vazio - o Dockerfile gerencia tudo)

#### Settings → Deploy
- **Start Command**: (deixar vazio - o Dockerfile gerencia)
- O Dockerfile já está configurado para usar a porta do Railway

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
- [ ] Builder: `DOCKERFILE` (ou NIXPACKS)
- [ ] Variável `ConnectionStrings__DefaultConnection` adicionada
- [ ] Public Networking habilitado
- [ ] Arquivo `Dockerfile` commitado no Git
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
- **Solução**: Use Builder `DOCKERFILE` (não NIXPACKS ou Metal)
- O Dockerfile garante que o .NET SDK esteja instalado

### Erro: "Connection string not found"
- **Solução**: Verifique se a variável `ConnectionStrings__DefaultConnection` está configurada
- Formato: `ConnectionStrings__DefaultConnection` (com dois underscores)

### Erro: "Port already in use"
- **Solução**: O Dockerfile já está configurado para usar `$PORT` do Railway
- Verifique se o `Program.cs` está usando `Environment.GetEnvironmentVariable("PORT")`

### CORS ainda bloqueando
- **Solução**: O código agora permite qualquer origem (`AllowAnyOrigin`)
- Se quiser restringir, configure `AllowedOrigins` via variável de ambiente

### Build falha no Railway
- **Solução**: Verifique se o `Dockerfile` está na pasta `backend/`
- Verifique se o Root Directory está configurado como `backend`

---

## 📝 Notas

- **Dockerfile** é a opção mais confiável para .NET no Railway
- O Dockerfile usa multi-stage build (otimizado)
- A porta é gerenciada automaticamente via variável `PORT` do Railway
- HTTPS é gerenciado pelo Railway (não precisa configurar)
- O arquivo `Dockerfile` está na pasta `backend/` e será detectado automaticamente

---

## 🎯 Resumo Rápido

1. **Root Directory**: `backend`
2. **Builder**: `DOCKERFILE`
3. **Variável**: `ConnectionStrings__DefaultConnection` = sua connection string
4. **Public Networking**: ✅ Habilitado
5. **Commit e Push**: Faça commit do `Dockerfile` e faça push

---

**Pronto para deploy! 🚀**
