# Passo 1: Entidades de Domínio - O que fizemos?

## ✅ O que criamos

### 1. BaseEntity (Classe Abstrata)
**POR QUÊ?**
- Evita duplicação de código (DRY)
- Todas as entidades precisam de Id, CreatedAt, UpdatedAt
- Soft delete padronizado

**DECISÕES:**
- `Id` como `int`: Simples, eficiente, auto-incremento
- `CreatedAt` sempre preenchido: Facilita auditoria
- `UpdatedAt` nullable: Só preenche quando atualizar
- `IsDeleted` para soft delete: Preserva histórico

### 2. Project (Projeto/Deployment)
**PROPRIEDADES PRINCIPAIS:**
- `Title`, `Category`, `Description`: Informações básicas
- `Tags`: String separada por vírgula (simples, mas pode evoluir)
- `Metric1Name/Value`, `Metric2Name/Value`: Métricas de impacto
- `DisplayOrder`: Controla ordem na UI

**DECISÕES DE DESIGN:**
- Métricas como propriedades específicas (não JSON genérico)
  - ✅ Type-safe
  - ✅ Facilita queries SQL
  - ✅ Melhor performance
  - ❌ Menos flexível (se precisar de 3+ métricas, precisa adicionar propriedades)

**TRADE-OFF:**
- Tags como string vs tabela ProjectTag
  - String: Simples, rápido de implementar
  - Tabela: Mais flexível, permite queries complexas

### 3. Skill (Habilidade Técnica)
**PROPRIEDADES:**
- `Name`: Nome da skill
- `Category`: Enum (type-safe)
- `Proficiency`: 0-100 (int para flexibilidade)

**DECISÕES:**
- Enum para Category: Type-safe, fácil de usar
- Proficiency como int: Permite valores como 95%, 88%
- Trade-off: Enum requer deploy para nova categoria

### 4. Experience (Experiência Profissional)
**PROPRIEDADES:**
- `Title`, `Company`, `Description`
- `StartDate`, `EndDate` (nullable = Present)
- `IsCurrent`: Flag para destacar posição atual

**DECISÕES:**
- EndDate nullable: Representa "Present" sem valor especial
- IsCurrent: Flag adicional para facilitar queries

## 🎯 Princípios Aplicados

### 1. Domain-Driven Design (DDD)
- Entidades representam conceitos do negócio
- Propriedades refletem o que o negócio precisa
- Nomes claros e expressivos

### 2. SOLID - Single Responsibility
- Cada entidade tem uma responsabilidade
- BaseEntity cuida apenas de propriedades comuns
- Não misturamos lógica de negócio aqui (isso vem depois em Services)

### 3. YAGNI (You Aren't Gonna Need It)
- Não criamos propriedades "por precaução"
- Começamos simples, evoluímos quando necessário
- Exemplo: Tags como string, não como tabela complexa

## ❓ Perguntas para você

1. **Por que usamos `int` para Id e não `Guid`?**
   - Resposta: int é mais simples, eficiente em queries, auto-incremento. Guid é melhor para sistemas distribuídos ou quando precisa gerar IDs no cliente.

2. **Por que `IsDeleted` (soft delete) em vez de deletar de verdade?**
   - Resposta: Preserva histórico, permite recuperação, atende LGPD, mantém integridade referencial.

3. **Por que `Tags` como string e não array ou tabela separada?**
   - Resposta: Simplicidade inicial. Se precisarmos buscar projetos por tag específica ou fazer análises complexas, migramos para tabela ProjectTag.

4. **Por que `Proficiency` como int (0-100) e não enum (Beginner, Intermediate, Advanced)?**
   - Resposta: Mais flexível (95%, 88%), permite cálculos, comparações numéricas. Enum seria mais limitado.

## 🚀 Próximo Passo

Agora vamos configurar o **Entity Framework Core** com PostgreSQL para:
1. Criar o DbContext
2. Configurar as entidades no banco
3. Criar migrations
4. Conectar ao PostgreSQL

**Por que fazer isso agora?**
- Precisamos do banco configurado antes de criar Repositories
- Migrations garantem que o schema está versionado
- Podemos testar se tudo está funcionando
