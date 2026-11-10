# Roadmap Sonora

## Versões Planejadas

### v0.1 - Music Discovery Core ✅

**Status**: Em desenvolvimento

**Objetivo**: Estabelecer arquitetura base e fluxo de busca

**Deliverables:**
- ✅ Monorepo estruturado (apps/api, apps/web)
- ✅ Frontend Next.js com UI de busca
- ✅ Backend NestJS com endpoints básicos
- ✅ PostgreSQL + Prisma ORM
- 🔄 Endpoint `GET /music/search?q=...` (mockado)
- 🔄 Página de detalhes `/music/:id` (mockada)
- 🔄 Documentação técnica completa

**Stack Confirmado:**
- Frontend: Next.js 16, TypeScript, Tailwind
- Backend: NestJS, Prisma, Vitest
- Database: PostgreSQL 16
- Infrastructure: Docker Compose

**Estimativa**: Setembro 2026

---

### v0.2 - Spotify Integration 🔄

**Objetivo**: Primeira integração real com API externa

**Deliverables:**
- SpotifyConnector (client, mapper, connector)
- Spotify API authentication (Client Credentials)
- Busca real contra Spotify Web API
- Cache local de resultados (5 minutos)
- Testes unitários e integração
- Documentação de setup Spotify
- Error handling com retry automático

**Novas Endpoints:**
```
GET /music/search?q=query
  ↓ busca local
  ↓ busca Spotify
  ↓ retorna resultados
```

**Novo Banco:**
```prisma
model Music {
  // ... campos existentes
  spotifyId String? @unique
}
```

**Estimativa**: Setembro 2026

---

### v0.3 - Multi-Source Discovery

**Objetivo**: Música + Livros + Artigos

**Deliverables:**
- YouTubeConnector (vídeos relacionados)
- GoogleBooksConnector (livros relacionados)
- Página de detalhes expandida:
  ```
  🎵 Construção
  Chico Buarque

  🎵 Músicas Relacionadas
  📚 Livros (tema: work, inequality)
  📄 Artigos (contexto: Brazilian MPB)
  ```
- Multi-source search orchestrator
- Ranking simples (por relevância)
- Tests de integração multi-fonte

**Novas Tabelas:**
```prisma
model Book { /* ... */ }
model Article { /* ... */ }
```

**Estimativa**: Outubro 2026

---

### v0.4 - AI Analysis

**Objetivo**: Inteligência automática na descoberta

**Deliverables:**
- AI Analyzer (LLM-powered)
- Extração automática de:
  - Themes (temas principais)
  - Contexts (contextos históricos/culturais)
  - Related concepts
- SearchPlan gerado automaticamente
  ```
  Música: "Construção"
  Themes: ["trabalho", "desigualdade", "urbanização"]
  Contexts: ["Brasil anos 1970", "MPB", "ditadura"]
     ↓
  Busca livros sobre: trabalho + desigualdade
  Busca artigos sobre: MPB + história
  Busca vídeos sobre: Chico Buarque
  ```
- Matriz de relação (what connects these)

**Novas Tabelas:**
```prisma
model SearchPlan { /* ... */ }
model Theme { /* ... */ }
```

**Estimativa**: Novembro 2026

---

### v1.0 - Full Experience 🎯

**Objetivo**: Produto completo e polido

**Deliverables:**
- Sistema de ranking final
- Favoritos e histórico do usuário
- Autenticação (OAuth, email/password)
- Recomendações personalizadas
- Compartilhamento (links públicos)
- Mobile responsivo otimizado
- PWA (offline básico)
- Performance (< 500ms p95)
- 99% uptime

**Novas Features:**
```
- Perfil do usuário
- Histórico de buscas
- Playlists criadas
- Compartilhamento social
- Analytics
```

**Estimativa**: Dezembro 2026

---

## Não Fazer Agora (Não Escopo)

Deliberadamente adiados para manter foco:

- ❌ Treinar modelo próprio (depende de dados)
- ❌ Knowledge graph (depois de v1.0)
- ❌ Redis cache (Prisma é suficiente)
- ❌ Dezenas de APIs (3 por versão max)
- ❌ Login social complexo (básico no v1.0)
- ❌ Aplicativo mobile nativo (PWA primeiro)
- ❌ Sistema de assinaturas (público primeiro)
- ❌ Partitura/notação (especializado)
- ❌ Pinturas/artes visuais (future scope)

---

## Marcos Importantes

### Junho 2026
- Ideação + especificação
- Setup inicial

### Setembro 2026 ✈️
- v0.1 Public Beta
- Release no GitHub
- Documentação completa

### Dezembro 2026 🎯
- v1.0 Stable
- SEO otimizado
- Launch público

### 2027+
- Expansão global (APIs em outras línguas)
- Análise de dados (o que pessoas descobrem)
- Parcerias estratégicas
- Monetização (sem parede de paywall v1.0)

---

## Métricas de Sucesso

### Técnicas
- [ ] Todas as APIs retornam < 200ms (p95)
- [ ] Coverage de testes > 80%
- [ ] Docs 100% atualizada
- [ ] Zero security vulnerabilities

### Produto
- [ ] UI intuitiva (teste com 5 usuários)
- [ ] Suporta 1000 buscas/dia
- [ ] 3+ conectores funcionais
- [ ] Compartilhamento funcional

### Comunidade
- [ ] 100 stars no GitHub
- [ ] 1 contribuidor externo
- [ ] 0 issues críticas abertos

---

## Timeline Visual

```
Jun ┬─ Setup
    │
Jul ├─ Development
    │
Aug ├─ Spotify Integration
  │
Sep ├──✈️ v0.1 Public
    │  └─ Beta testers
    │
Oct ├─ Multi-source
    │  └─ YouTube + Books
    │
Nov ├─ AI Analysis
    │
Dec └──🎯 v1.0 Launch

2027 ┌─ Growth Phase
     └─ Scale + Partnerships
```

---

## Como Contribuir

Vendo este roadmap?

1. Verifique issues abertos
2. Escolha uma task de uma versão futura
3. Abra PR com implementação
4. Documente a mudança

Todos são bem-vindos!
