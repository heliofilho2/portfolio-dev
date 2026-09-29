# Deploy

Push na `main` publica os dois lados automaticamente:

- **Vercel** (frontend) — Root Directory `frontend`, preset Next.js
- **Railway** (backend) — Root Directory `backend`, builder `DOCKERFILE` (`backend/railway.toml`)

## Checklist depois de um deploy

- [ ] `https://<railway>/api/profile` retorna JSON
- [ ] Home carrega com produtos, conteúdo, projetos, experiência e stack
- [ ] `/about` e `/projects/1` abrem
- [ ] POST/PUT/DELETE sem `X-API-Key` retornam 401

## Modo manutenção

Setar `MAINTENANCE_MODE=true` na Vercel e fazer **Redeploy** (variável nova só vale após novo deploy). Para voltar ao normal, remover a variável ou trocar para `false` e fazer redeploy.

## Escrevendo na API

Endpoints de escrita exigem o header `X-API-Key` com o valor da env var `API_KEY` do Railway:

```bash
curl -X PUT https://<railway>/api/projects/1 \
  -H "Content-Type: application/json" \
  -H "X-API-Key: <sua-api-key>" \
  -d '{ ... }'
```

GET é público. O Swagger só abre em desenvolvimento.

## Troubleshooting

| Sintoma | Causa provável |
|---|---|
| Home sem projetos/experiência/stack | API fora do ar ou `NEXT_PUBLIC_API_URL` errada na Vercel |
| API responde 500 | Supabase pausado (plano free pausa após inatividade — clicar em **Restore**) ou `DATABASE_CONNECTION_STRING` inválida |
| Site inteiro mostra "Em manutenção" | `MAINTENANCE_MODE=true` na Vercel |
| Mudei variável na Vercel e nada mudou | Falta o Redeploy |
