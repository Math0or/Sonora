# Arquitetura Sonora

## Visão Geral

Sonora é um sistema de descoberta de conhecimento que começa com uma **música** e mapeia seu universo relacionado através de múltiplas fontes de dados.

## Arquitetura em Camadas

```
┌─────────────────────────────────────────┐
│         Frontend (Next.js)              │
│  - UI de busca e exploração             │
│  - Apresentação de resultados           │
└────────────┬────────────────────────────┘
             │ HTTP/REST
┌────────────▼────────────────────────────┐
│         API Gateway (NestJS)            │
│  - Roteamento                           │
│  - Autenticação                         │
│  - Rate limiting                        │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│       Service Layer                     │
│  - MusicService                         │
│  - SearchService                        │
│  - ConnectorService                     │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│      Resolver / Orchestrator            │
│  - MusicResolver                        │
│  - Multi-source aggregation             │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│      Connector Layer                    │
│  - SpotifyConnector                     │
│  - YouTubeConnector (futuro)            │
│  - GoogleBooksConnector (futuro)        │
│  - OpenAlexConnector (futuro)           │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│      External APIs                      │
│  - Spotify Web API                      │
│  - YouTube API                          │
│  - Google Books API                     │
│  - OpenAlex API                         │
└─────────────────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│       Data Layer                        │
│  - PostgreSQL + Prisma ORM              │
└─────────────────────────────────────────┘
```

## Componentes Principais

### Frontend (apps/web)
- **Framework**: Next.js 16.3.4
- **Styling**: Tailwind CSS
- **State**: React (Context/Hooks)
- **Type Safety**: TypeScript

### Backend (apps/api)
- **Framework**: NestJS
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Testing**: Vitest

### Banco de Dados
- **Engine**: PostgreSQL 16 (Docker)
- **Migration Tool**: Prisma Migrate
- **Connection**: Pool via Prisma Client

## Fluxo de Requisição

### Exemplo: Buscar Música

```
1. Usuário digita "Construção Chico Buarque"
                    ↓
2. Frontend envia: GET /music/search?q=Construção%20Chico%20Buarque
                    ↓
3. Controller.search() recebe a query
                    ↓
4. MusicService.search() busca no banco local
                    ↓
5. Se não encontrado, SpotifyConnector busca na API
                    ↓
6. Resultado é mapeado e retornado
                    ↓
7. Frontend renderiza lista de resultados
```

## Princípios de Design

### 1. **Separation of Concerns**
- Controllers: Roteamento e validação
- Services: Lógica de negócio
- Resolvers: Orquestração multi-fonte
- Connectors: Integração externa

### 2. **Dependency Injection**
- NestJS nativo para IoC
- Fácil testabilidade
- Baixo acoplamento

### 3. **Data First**
- Schema Prisma como source of truth
- Migrations versionadas
- Type safety end-to-end

### 4. **Connector Pattern**
- Interface comum para todas as fontes
- Mapper para normalizar dados
- Fallback gracioso em caso de falha

## Fase Atual: v0.1

**Music Discovery Core**

- ✅ Frontend pronto
- ✅ Backend estruturado
- ✅ Banco de dados configurado
- 🔄 Busca mockada
- ⏳ Connectors (próximo)
- ⏳ IA/Análise (futuro)

## Próximas Fases

### v0.2 - Spotify Integration
- Implementar SpotifyConnector
- Busca real contra Spotify Web API
- Cache local de resultados

### v0.3 - Multi-source
- YouTubeConnector
- Google Books Connector
- Página de detalhes expandida

### v0.4 - AI Analysis
- AI Analyzer
- Extração de temas e contextos
- SearchPlan automático

### v1.0 - Full Experience
- Sistema de ranking
- Recomendações
- Favoritos e histórico
