# Database Schema

## Visão Geral

O banco de dados Sonora é projetado para armazenar metadados sobre músicas e suas relações com outros tipos de conteúdo.

## Tabelas Atuais

### Music

Entidade central do sistema.

```prisma
model Music {
  id          String   @id @default(uuid())
  title       String
  artist      String
  album       String?
  releaseDate DateTime?
  spotifyId   String?  @unique
  youtubeId   String?  @unique
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Campos:**

| Campo | Tipo | Descrição | Notas |
|-------|------|-----------|-------|
| `id` | UUID | Identificador único | Gerado automaticamente |
| `title` | String | Título da música | Obrigatório |
| `artist` | String | Nome do artista | Obrigatório |
| `album` | String? | Álbum | Opcional |
| `releaseDate` | DateTime? | Data de lançamento | Opcional |
| `spotifyId` | String? | ID no Spotify | Único, indexado |
| `youtubeId` | String? | ID no YouTube | Único, indexado |
| `createdAt` | DateTime | Data de criação | Auto-populado |
| `updatedAt` | DateTime | Última atualização | Auto-atualizado |

## Tabelas Futuras (Roadmap)

### Books
```prisma
model Book {
  id          String   @id @default(uuid())
  title       String
  author      String
  isbn        String?  @unique
  googleId    String?  @unique
  publishedYear Int?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Articles
```prisma
model Article {
  id          String   @id @default(uuid())
  title       String
  authors     String
  doi         String?  @unique
  url         String?
  publishedYear Int?
  source      String   // "openAlex", "crossref", etc
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### SearchPlans (IA)
```prisma
model SearchPlan {
  id          String   @id @default(uuid())
  musicId     String
  music       Music    @relation(fields: [musicId], references: [id])
  themes      String[] // ["trabalho", "desigualdade"]
  contexts    String[] // ["Brasil dos anos 1970"]
  createdAt   DateTime @default(now())
}
```

## Setup Local

### Prerequisites
- PostgreSQL 16
- Docker (recomendado)
- Node.js v26+

### Inicialização

1. **Iniciar PostgreSQL com Docker Compose**

```bash
cd /path/to/Sonora
docker compose up -d
```

2. **Configurar variáveis de ambiente**

```bash
# apps/api/.env
DATABASE_URL="postgresql://sonora:sonora@localhost:5432/sonora"
```

3. **Rodar migrations Prisma**

```bash
cd apps/api
npx prisma migrate dev --name init
```

4. **Gerar Prisma Client**

```bash
npx prisma generate
```

5. **Seed inicial (opcional)**

```bash
npx prisma db seed
```

## Conexão

### Connection String

```
postgresql://[user]:[password]@[host]:[port]/[database]
```

**Valores padrão:**
- User: `sonora`
- Password: `sonora`
- Host: `localhost`
- Port: `5432`
- Database: `sonora`

### Pool de Conexões

Prisma gerencia automaticamente o pool. Configurável via:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Migrations

### Criar migration

```bash
npx prisma migrate dev --name [name]
```

### Aplicar migrations (produção)

```bash
npx prisma migrate deploy
```

### Resetar banco (desenvolvimento)

```bash
npx prisma migrate reset
```

## Queries Comuns

### Buscar música por título

```typescript
const music = await prisma.music.findFirst({
  where: { title: "Construção" }
});
```

### Buscar por Spotify ID

```typescript
const music = await prisma.music.findUnique({
  where: { spotifyId: "spotify:track:123" }
});
```

### Criar nova música

```typescript
const newMusic = await prisma.music.create({
  data: {
    title: "Construção",
    artist: "Chico Buarque",
    album: "Construção",
    spotifyId: "spotify:track:123"
  }
});
```

### Atualizar música

```typescript
const updated = await prisma.music.update({
  where: { id: "uuid" },
  data: { youtubeId: "dQw4w9WgXcQ" }
});
```

## Performance

### Índices

Automáticos via Prisma:
- Primary Key: `id`
- Unique: `spotifyId`, `youtubeId`

### Recomendações

- Sempre filtrar por `id` ou campos unique quando possível
- Usar `select` para trazer apenas campos necessários
- Implementar cache para queries frequentes

## Backup

### Criar backup

```bash
docker exec sonora-postgres pg_dump -U sonora sonora > backup.sql
```

### Restaurar backup

```bash
docker exec -i sonora-postgres psql -U sonora sonora < backup.sql
```
