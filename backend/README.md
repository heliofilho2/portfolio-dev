# Portfolio Backend - Clean Architecture

## Estrutura do Projeto

```
backend/
├── Portfolio.API/              # Presentation Layer (Controllers, Middleware)
├── Portfolio.Application/        # Application Layer (Services, DTOs, Interfaces)
├── Portfolio.Domain/            # Domain Layer (Entities, Value Objects)
└── Portfolio.Infrastructure/    # Infrastructure Layer (Data, Repositories)
```

## Por que essa estrutura?

**Clean Architecture** separa o código em camadas com dependências unidirecionais:
- **Domain**: Núcleo do negócio, SEM dependências externas
- **Application**: Lógica de aplicação, depende APENAS de Domain
- **Infrastructure**: Implementações técnicas, depende de Domain e Application
- **API**: Interface HTTP, depende de Application

Isso garante que mudanças em frameworks (EF Core, HTTP) não afetem a lógica de negócio.
