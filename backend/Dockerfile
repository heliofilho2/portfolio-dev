# Dockerfile para Railway
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar arquivos de projeto
COPY Portfolio.sln .
COPY Portfolio.Domain/Portfolio.Domain.csproj Portfolio.Domain/
COPY Portfolio.Application/Portfolio.Application.csproj Portfolio.Application/
COPY Portfolio.Infrastructure/Portfolio.Infrastructure.csproj Portfolio.Infrastructure/
COPY Portfolio.API/Portfolio.API.csproj Portfolio.API/

# Restaurar dependências
RUN dotnet restore

# Copiar código fonte
COPY . .

# Build
WORKDIR /src/Portfolio.API
RUN dotnet build -c Release -o /app/build

# Publish
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Railway injeta PORT via variável de ambiente
ENV ASPNETCORE_URLS=http://0.0.0.0:${PORT:-8080}

ENTRYPOINT ["dotnet", "Portfolio.API.dll"]
