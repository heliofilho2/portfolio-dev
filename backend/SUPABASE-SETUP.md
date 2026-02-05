# Como Configurar Supabase

## 📋 Passo a Passo

### 1. Criar Projeto no Supabase

1. Acesse https://supabase.com
2. Faça login (pode usar GitHub)
3. Clique em "New Project"
4. Preencha:
   - **Name**: portfolio-db (ou o que preferir)
   - **Database Password**: Crie uma senha forte (ANOTE ELA!)
   - **Region**: Escolha mais próxima (South America se disponível)
5. Aguarde criação (2-3 minutos)

### 2. Obter Connection String

1. No projeto criado, vá em **Settings** (ícone de engrenagem)
2. Clique em **Database**
3. Role até **Connection string**
4. Escolha **URI** ou **Parameters**

**Formato URI:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

**Formato Parameters (mais legível):**
```
Host=db.xxxxx.supabase.co;
Port=5432;
Database=postgres;
Username=postgres;
Password=[YOUR-PASSWORD];
SSL Mode=Require;
```

### 3. Configurar no Projeto

#### Opção A: appsettings.Development.json (Desenvolvimento Local)

Edite `Portfolio.API/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=db.xxxxx.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=SUA_SENHA;SSL Mode=Require;"
  }
}
```

#### Opção B: Variável de Ambiente (Recomendado para Produção)

**Windows (PowerShell):**
```powershell
$env:ConnectionStrings__DefaultConnection="Host=db.xxxxx.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=SUA_SENHA;SSL Mode=Require;"
```

**Linux/Mac:**
```bash
export ConnectionStrings__DefaultConnection="Host=db.xxxxx.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=SUA_SENHA;SSL Mode=Require;"
```

**Azure App Service:**
1. Vá em Configuration > Application settings
2. Adicione: `ConnectionStrings__DefaultConnection`
3. Valor: Sua connection string

### 4. Testar Conexão

Depois de configurar, vamos criar as migrations e testar!

## 🔒 Segurança

### ❌ NUNCA FAÇA:
- Commitar connection string no Git
- Compartilhar senha publicamente
- Usar a mesma senha em dev/prod

### ✅ SEMPRE FAÇA:
- Use variáveis de ambiente em produção
- Use `.gitignore` para appsettings com senhas
- Rotacione senhas periodicamente
- Use diferentes projetos Supabase para dev/prod

## 📝 Próximo Passo

Depois de configurar, vamos:
1. Criar migrations (criar tabelas no banco)
2. Aplicar migrations no Supabase
3. Testar conexão
