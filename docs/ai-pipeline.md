# AI Pipeline

## Visão Geral

O AI Pipeline do Sonora (v0.4+) é responsável por:
1. Analisar a música inicial
2. Extrair temas e contextos
3. Gerar um plano de busca automatizado
4. Orquestrar buscas multi-fonte

## Arquitetura

```
Input: Music
   ↓
┌──────────────────────────────────────┐
│  AI Analyzer                         │
│  (LLM-powered analysis)              │
├──────────────────────────────────────┤
│ ✓ Extract themes                     │
│ ✓ Identify contexts                  │
│ ✓ Find related concepts              │
└──────────────────────────────────────┘
   ↓
┌──────────────────────────────────────┐
│  SearchPlan Generator                │
│  (Cria queries para cada fonte)      │
├──────────────────────────────────────┤
│ ✓ Books queries (temas)              │
│ ✓ Articles queries (contextos)       │
│ ✓ Videos queries (músico/álbum)      │
└──────────────────────────────────────┘
   ↓
┌──────────────────────────────────────┐
│  Connector Orchestrator              │
│  (Executa queries em paralelo)       │
├──────────────────────────────────────┤
│ → YouTubeConnector.search(...)       │
│ → GoogleBooksConnector.search(...)   │
│ → OpenAlexConnector.search(...)      │
└──────────────────────────────────────┘
   ↓
┌──────────────────────────────────────┐
│  Ranking & Aggregation               │
│  (Normaliza e ordena resultados)     │
├──────────────────────────────────────┤
│ ✓ Score por source                   │
│ ✓ Deduplicate                        │
│ ✓ Rank final                         │
└──────────────────────────────────────┘
   ↓
Output: Sonora Universe
```

## AI Analyzer

### Input

```typescript
{
  id: "uuid",
  title: "Construção",
  artist: "Chico Buarque",
  album: "Construção",
  releaseDate: "1971-07-01"
}
```

### Prompt

```
Analise a música "Construção" de Chico Buarque (1971).

Responda em JSON:
{
  "themes": ["tema1", "tema2", ...],
  "contexts": ["contexto1", "contexto2", ...],
  "artist_influences": ["influencia1", ...],
  "contemporary_works": ["obra1", ...],
  "keywords": ["palavra-chave", ...]
}
```

### Output

```json
{
  "themes": [
    "trabalho",
    "desigualdade social",
    "urbanização",
    "desenvolvimento econômico",
    "condição humana"
  ],
  "contexts": [
    "Brasil anos 1970",
    "ditadura militar",
    "MPB (Música Popular Brasileira)",
    "movimento estudantil",
    "economia brasileira"
  ],
  "artist_influences": [
    "Paulo Honório (João Guimarães Rosa)",
    "Jorge Amado",
    "Augusto dos Anjos"
  ],
  "contemporary_works": [
    "Dom Casmurro (Machado de Assis)",
    "Toda Menina Baiana (Gilberto Gil)",
    "O Cortiço (Aluísio Azevedo)"
  ],
  "keywords": [
    "alvenaria",
    "operário",
    "cidade",
    "mudança",
    "esperança",
    "resistência"
  ]
}
```

## SearchPlan

Gerado automaticamente a partir da análise:

```typescript
interface SearchPlan {
  musicId: string;
  queries: {
    books: string[];      // Baseado em themes
    articles: string[];   // Baseado em contexts
    videos: string[];     // Baseado em artist/song
  };
  expected_results: {
    books: number;        // Estimativa
    articles: number;
    videos: number;
  };
  created_at: Date;
}
```

### Exemplo

```json
{
  "musicId": "123",
  "queries": {
    "books": [
      "trabalho desigualdade social",
      "urbanização Brasil anos 1970",
      "desenvolvimento econômico"
    ],
    "articles": [
      "MPB Brazilian music 1970s",
      "Brazilian military dictatorship culture",
      "trabalho condição humana"
    ],
    "videos": [
      "Chico Buarque Construção",
      "MPB 1970 Brasil"
    ]
  },
  "expected_results": {
    "books": 15,
    "articles": 25,
    "videos": 10
  }
}
```

## Connector Orchestrator

### Execução Paralela

```typescript
async function executeSearchPlan(plan: SearchPlan) {
  const [books, articles, videos] = await Promise.all([
    googleBooksConnector.searchMultiple(plan.queries.books),
    openAlexConnector.searchMultiple(plan.queries.articles),
    youtubeConnector.searchMultiple(plan.queries.videos)
  ]);

  return { books, articles, videos };
}
```

### Error Resilience

```
Sucesso: YouTube ✓ | Books ✓ | Articles ✓
Sucesso: YouTube ✓ | Books ✓ | Articles ✗ (mostrar com aviso)
Sucesso: YouTube ✓ | Books ✗ | Articles ✗ (mostrar YouTube)
Falha: YouTube ✗ | Books ✗ | Articles ✗ (erro)
```

## Ranking Algorithm

### V0.4 (Simples)

```typescript
function rankResults(results: Result[]): Result[] {
  return results.sort((a, b) => {
    // Score por fonte
    const sourceScore = {
      'book': 1.0,
      'article': 1.2,      // Artigos rankeam melhor
      'video': 0.8
    };

    const scoreA = sourceScore[a.source] * a.confidence;
    const scoreB = sourceScore[b.source] * b.confidence;

    return scoreB - scoreA;
  });
}
```

### V1.0 (Avançado)

```typescript
function rankResults(results: Result[], user: User): Result[] {
  // Machine learning ranking
  // Baseado em:
  // - Source reliability (histórico)
  // - User preferences (favoritos)
  // - Temporal decay (recente vs antigo)
  // - Collaborative filtering

  return results.sort((a, b) => {
    return mlModel.predictRelevance(b, user) -
           mlModel.predictRelevance(a, user);
  });
}
```

## Models / LLMs

### Recomendado para v0.4

- **OpenAI GPT-4o** (análise profunda, $0.015 por request)
- **Claude 3 Opus** (excelente contexto, $0.015 por request)
- **Local LLM** (Ollama + Llama 2, gratuito mas lento)

### Integração

```typescript
@Injectable()
export class AIAnalyzerService {
  constructor(
    @Inject('LLM_CLIENT') private llm: LLMClient
  ) {}

  async analyze(music: Music): Promise<AnalysisResult> {
    const prompt = this.buildPrompt(music);
    const response = await this.llm.complete({
      prompt,
      temperature: 0.7,
      max_tokens: 1000
    });

    return JSON.parse(response);
  }
}
```

## Caching

### AI Analysis Cache

```
Cache Key: `ai_analysis:${musicId}`
TTL: 30 dias (análise não muda)
Invalidate: Quando music é atualizado
```

### SearchPlan Cache

```
Cache Key: `searchplan:${musicId}`
TTL: 7 dias
Invalidate: Nunca (determinístico)
```

## Logging & Monitoring

### Métricas

```
- AI Analysis latency (ms)
- SearchPlan generation time
- Connector execution time (por fonte)
- Total pipeline duration
- Cache hit rate
- Erro rate (por etapa)
```

### Exemplo

```
[AI] Analyzed "Construção" in 2345ms
[SP] Generated 3 book queries, 3 article queries
[CONN] YouTube: 45ms | Books: 123ms | Articles: 67ms
[TOTAL] Pipeline completed in 2.8s
[CACHE] Hit rate: 73%
```

## Falhas e Fallbacks

### Se AI falhar
```
→ Usar análise básica (title, artist)
→ Gerar queries simples
→ Continuar com orquestrador
```

### Se Connector falhar
```
→ Pular fonte específica
→ Retornar o que tem
→ Log do erro
→ Retry em 5 minutos (background)
```

### Se tudo falhar
```
→ Retornar música apenas
→ Sugerir usuário fazer busca manual
→ Notificar admin
```

## Roadmap IA

- **v0.4**: Análise básica + SearchPlan
- **v0.5**: Multi-language support
- **v0.6**: Clustering temático
- **v1.0**: ML ranking
- **v1.1**: Recomendações colaborativas
- **v2.0**: Knowledge graph generation

## Cost Estimates

### Por execução (v0.4)

| Operação | Provider | Custo |
|----------|----------|-------|
| AI Analysis | OpenAI | $0.015 |
| Connector Calls | APIs | $0.001 |
| Storage | PostgreSQL | $0.0001 |
| **Total** | | **$0.016** |

### Por mês (1000 análises)

| Item | Custo |
|------|-------|
| AI (1000×) | $15 |
| Connectors | $10 |
| Infrastructure | $50 |
| **Total** | **$75** |

Escala bem em ~100K análises mensais.
