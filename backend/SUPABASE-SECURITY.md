# 🔒 Segurança no Supabase - Row Level Security (RLS)

## O que significa "Unrestricted"?

**Unrestricted** = Sem Row Level Security (RLS) habilitado
- Qualquer conexão com a connection string pode acessar todas as tabelas
- Não há políticas de segurança no nível do banco
- Acesso direto via connection string = acesso total

## Para um Portfólio Estático: Está OK?

### ✅ **Pode estar OK se:**

1. **Apenas você edita** via Swagger/backend
2. **Connection string está segura** (não commitada no Git)
3. **Backend não expõe endpoints públicos** de escrita (POST/PUT/DELETE)
4. **É apenas um portfólio pessoal** (não dados sensíveis)

### ⚠️ **Mas há riscos:**

1. **Se alguém conseguir a connection string:**
   - Pode ler TODOS os dados
   - Pode modificar/deletar tudo
   - Não há camada de proteção no banco

2. **Se o backend tiver vulnerabilidades:**
   - SQL Injection (se não usar EF Core corretamente)
   - Acesso não autorizado aos endpoints

3. **Em produção:**
   - Melhor ter RLS mesmo que permissivo
   - Camada extra de segurança
   - Boas práticas

## 🎯 Recomendação para Portfólio Estático

### Opção 1: Deixar Unrestricted (Atual) ✅
**Quando usar:**
- Portfólio pessoal simples
- Apenas você edita
- Connection string bem protegida
- Backend não expõe endpoints públicos de escrita

**Vantagens:**
- Simples
- Sem configuração extra
- Funciona direto

**Desvantagens:**
- Menos seguro
- Se connection string vazar = problema

### Opção 2: Habilitar RLS (Recomendado) 🔒
**Quando usar:**
- Quer camada extra de segurança
- Boas práticas
- Pode escalar no futuro

**Como fazer:**
1. No Supabase Dashboard → Authentication → Policies
2. Habilitar RLS em cada tabela
3. Criar políticas permissivas (já que só você acessa)

**Exemplo de política permissiva:**
```sql
-- Permite tudo para usuário postgres (sua connection string)
CREATE POLICY "Allow all for service role"
ON profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
```

## 📋 Checklist de Segurança

### ✅ Já está OK:
- [x] Connection string não está no Git (usando appsettings.Development.json que está no .gitignore)
- [x] Backend usa EF Core (protege contra SQL Injection)
- [x] Endpoints de escrita não são públicos (apenas você acessa via Swagger)

### ⚠️ Pode melhorar:
- [ ] Habilitar RLS nas tabelas (opcional, mas recomendado)
- [ ] Usar variáveis de ambiente em produção (não appsettings.json)
- [ ] Limitar IPs que podem acessar Supabase (se possível)

## 🚀 Para Produção

Quando fizer deploy:

1. **Connection string em variável de ambiente:**
   ```bash
   # Azure App Service
   ConnectionStrings__DefaultConnection="Host=..."
   ```

2. **Habilitar RLS (opcional mas recomendado):**
   - Camada extra de segurança
   - Boas práticas

3. **Monitorar acessos:**
   - Supabase Dashboard → Logs
   - Verificar acessos suspeitos

## ❓ Resposta Direta

**Para um portfólio estático pessoal:**
- ✅ **Unrestricted está OK** se você:
  - Protege bem a connection string
  - Não expõe endpoints públicos de escrita
  - É apenas você editando

- 🔒 **Mas seria melhor** habilitar RLS mesmo que permissivo:
  - Camada extra de segurança
  - Boas práticas
  - Se escalar no futuro, já está configurado

## 🎓 Conclusão

**Para seu caso (portfólio estático):**
- Unrestricted está **funcionalmente OK**
- Mas habilitar RLS seria **mais seguro e profissional**

**Recomendação:** Deixe unrestricted por enquanto (está OK), mas considere habilitar RLS quando fizer deploy em produção.

---

**Quer que eu te ajude a configurar RLS? É opcional, mas posso mostrar como fazer!**
