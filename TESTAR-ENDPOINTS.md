# 🧪 Como Testar os Endpoints da API

## ✅ Swagger Funcionando

Se o Swagger abriu em `https://portfolio-dev-production-d03e.up.railway.app/swagger`, o backend está funcionando!

## 🔍 Testar Endpoints Individualmente

Abra cada URL no navegador para verificar se retorna JSON:

### 1. Profile
```
https://portfolio-dev-production-d03e.up.railway.app/api/profile
```
**Esperado:** JSON com dados do perfil (name, role, description, etc.)

### 2. Projects
```
https://portfolio-dev-production-d03e.up.railway.app/api/projects
```
**Esperado:** Array JSON com projetos

### 3. Skills
```
https://portfolio-dev-production-d03e.up.railway.app/api/skills
```
**Esperado:** Array JSON com skills

### 4. Experiences
```
https://portfolio-dev-production-d03e.up.railway.app/api/experiences
```
**Esperado:** Array JSON com experiências

---

## ⚠️ Por que `/api` sozinho não funciona?

O `/api` é apenas o **prefixo base** da API. Os endpoints reais são:
- `/api/profile` ✅
- `/api/projects` ✅
- `/api/skills` ✅
- `/api/experiences` ✅

O frontend usa essa URL base (`https://.../api`) e adiciona o endpoint específico (`/profile`, `/projects`, etc.).

---

## 🚀 Próximo Passo: Configurar Vercel

Agora que confirmamos que o backend funciona, configure a variável no Vercel:

1. **Vercel Dashboard** → Seu Projeto → **Settings** → **Environment Variables**
2. Adicione:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://portfolio-dev-production-d03e.up.railway.app/api`
   - **Environments:** Production, Preview, Development
3. **Salve** e faça **Redeploy**

---

## ✅ Verificar se Funcionou

Após configurar e fazer redeploy:

1. Abra o site no Vercel
2. Pressione `F12` → **Console**
3. Procure por:
   ```
   [API] API_BASE_URL configurada: https://portfolio-dev-production-d03e.up.railway.app/api
   ```
4. Se aparecer `localhost:5115`, a variável não foi aplicada (faça redeploy novamente)
