# Connector Architecture

## Visão Geral

Connectors são a camada de integração com APIs externas. Cada connector segue um padrão comum para normalizar dados de fontes diferentes.

## Padrão Connector

```
Connector
├── .client.ts      → Comunicação com API
├── .mapper.ts      → Normalização de dados
└── .connector.ts   → Interface pública
```

### Estrutura

```typescript
// spotify.connector.ts
export class SpotifyConnector {
  constructor(
    private client: SpotifyClient,
    private mapper: SpotifyMapper
  ) {}

  async search(query: string): Promise<MusicResult[]> {
    const results = await this.client.search(query);
    return results.map(r => this.mapper.toMusicResult(r));
  }
}

// spotify.client.ts
export class SpotifyClient {
  async search(query: string) {
    // Implementação específica da Spotify API
  }
}

// spotify.mapper.ts
export class SpotifyMapper {
  toMusicResult(spotifyTrack: any): MusicResult {
    return {
      id: spotifyTrack.id,
      title: spotifyTrack.name,
      artist: spotifyTrack.artists[0].name,
      sourceId: spotifyTrack.id,
      source: 'spotify'
    };
  }
}
```

## Connectors Planejados

### 1. SpotifyConnector (v0.2)

**API**: Spotify Web API
**Autenticação**: Client Credentials Flow
**Rate Limit**: 429 quando excedido
**Dados**: Tracks, Artists, Albums

**Endpoints utilizados:**
- `GET /v1/search` - Buscar tracks
- `GET /v1/tracks/{id}` - Detalhes da track

**Mapper normaliza para:**
```typescript
{
  id: string;
  title: string;
  artist: string;
  album?: string;
  releaseDate?: Date;
  spotifyId: string;
  source: 'spotify';
}
```

### 2. YouTubeConnector (v0.3)

**API**: YouTube Data API v3
**Autenticação**: API Key
**Rate Limit**: 10,000 unidades/dia
**Dados**: Videos, Channels

**Mapper normaliza para:**
```typescript
{
  id: string;
  title: string;
  artist: string; // channel name
  youtubeId: string;
  source: 'youtube';
}
```

### 3. GoogleBooksConnector (v0.3)

**API**: Google Books API
**Autenticação**: API Key
**Rate Limit**: 1,000 req/dia (anônimo)
**Dados**: Books

### 4. OpenAlexConnector (v0.4)

**API**: OpenAlex REST API
**Autenticação**: Nenhuma (públic)
**Rate Limit**: 10 req/segundo
**Dados**: Artigos acadêmicos

### 5. CrossrefConnector (v0.4)

**API**: Crossref REST API
**Autenticação**: Nenhuma (público)
**Rate Limit**: Polite requests
**Dados**: Artigos DOI

## Interface Comum

```typescript
export interface IConnector {
  search(query: string): Promise<ConnectorResult[]>;
  getDetails(id: string): Promise<ConnectorResult>;
}

export interface ConnectorResult {
  id: string;
  title: string;
  description?: string;
  sourceId: string;
  source: string;
  metadata?: Record<string, any>;
}
```

## Error Handling

```typescript
export enum ConnectorError {
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMITED = 'RATE_LIMITED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  NETWORK_ERROR = 'NETWORK_ERROR'
}

class ConnectorException extends Error {
  constructor(
    public code: ConnectorError,
    message: string
  ) {
    super(message);
  }
}
```

## Caching Strategy

```
Query
  ↓
Cache Local (Redis) [5 min]
  ↓
Banco de Dados (Prisma)
  ↓
External API (Connector)
  ↓
Salvar no BD + Cache
```

## Rate Limiting

Cada connector implementa backoff exponencial:

```typescript
async search(query: string, attempt = 0) {
  try {
    return await this.client.search(query);
  } catch (error) {
    if (error.code === 429 && attempt < 3) {
      const delay = Math.pow(2, attempt) * 1000;
      await sleep(delay);
      return this.search(query, attempt + 1);
    }
    throw error;
  }
}
```

## Testing

Cada connector tem mocks:

```typescript
// spotify.connector.spec.ts
describe('SpotifyConnector', () => {
  it('should search and normalize results', async () => {
    const connector = new SpotifyConnector(
      mockSpotifyClient,
      new SpotifyMapper()
    );

    const results = await connector.search('Construção');

    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Construção');
  });
});
```

## Extensão

Para adicionar um novo connector:

1. **Criar estrutura de pastas**
```
connectors/
└── novo-connector/
    ├── novo-connector.connector.ts
    ├── novo-connector.client.ts
    ├── novo-connector.mapper.ts
    └── novo-connector.connector.spec.ts
```

2. **Implementar a interface**
```typescript
export class NovoConnector implements IConnector {
  // ...
}
```

3. **Registrar no módulo**
```typescript
@Module({
  providers: [NovoConnector]
})
export class ConnectorsModule {}
```

4. **Testar com mocks**
```typescript
describe('NovoConnector', () => {
  // Testes...
});
```

## Monitoramento

Metricas por connector:
- Tempo de resposta
- Taxa de sucesso
- Erros por tipo
- Chamadas/minuto
