# Sonora

> Comece com uma música e descubra todo o universo relacionado a ela.

Sonora é um projeto de descoberta de conteúdo a partir de músicas. A proposta é encontrar conexões entre uma faixa e outros materiais, como livros, artigos científicos, outras músicas e contextos históricos ou culturais.

A ideia é ir além de recomendações de músicas parecidas: cada resultado deve ter uma relação identificável com a música pesquisada, e essa relação deve ser explicada.

## Sobre o projeto

O desenvolvimento está sendo feito por etapas. A primeira versão concentra-se na estrutura da aplicação e na pesquisa de músicas. Recursos como análise com IA, busca semântica e integração com diferentes fontes serão adicionados gradualmente.

## Tecnologias

A stack planejada para o projeto é:

- **Frontend:** Next.js, React e TypeScript
- **Estilização:** Tailwind CSS
- **Backend:** NestJS
- **Banco de dados:** PostgreSQL
- **ORM:** Prisma
- **Ambiente local:** Docker Compose

Integrações com serviços externos e APIs de IA serão adicionadas conforme cada etapa for implementada.

## Estado atual

### v0.1 — Estrutura inicial

O foco desta etapa é preparar a base do projeto:

- Estrutura inicial de frontend e backend.
- Configuração do banco de dados.
- Cadastro e consulta de músicas.
- Primeira interface de pesquisa.
- Resultados simulados para desenvolver e testar o fluxo inicial.

As funcionalidades listadas nesta seção representam o escopo da versão inicial; consulte o código do repositório para verificar o que já está implementado.

## Roadmap

As próximas etapas previstas são:

| Versão | Objetivo |
| --- | --- |
| **v0.1** | Estrutura inicial, banco de dados e fluxo básico de pesquisa |
| **v0.2** | Integração com Spotify e identificação de músicas por link |
| **v0.3** | Integração com outras fontes, começando por vídeos e livros |
| **v0.4** | Análise de temas e contextos com IA |
| **v1.0** | Busca semântica, classificação dos resultados e experiência mais completa |

Esse planejamento pode mudar conforme os testes e as decisões tomadas durante o desenvolvimento.

## Arquitetura

A aplicação está organizada em três partes principais:

```text
Frontend (Next.js)
       |
       v
Backend (NestJS)
       |
       v
Banco de dados (PostgreSQL)
```

O backend concentra as regras da aplicação e será responsável por conversar com os serviços externos. A ideia é manter cada integração separada das demais, para que novas fontes possam ser adicionadas sem precisar alterar toda a aplicação.

## Estrutura do projeto

```text
sonora/
├── apps/
│   ├── api/       # Backend
│   └── web/       # Frontend
├── docs/          # Documentação do projeto
├── docker-compose.yml
└── README.md
```

A estrutura pode ganhar novas pastas e pacotes conforme o projeto crescer.

## Fontes de dados planejadas

Estas são algumas das fontes que podem fazer parte do Sonora. A integração com cada serviço depende da implementação e das condições de uso de suas APIs.

| Serviço | Uso previsto |
| --- | --- |
| Spotify | Informações sobre músicas e artistas |
| YouTube | Identificação e informações de vídeos |
| Google Books | Busca de livros |
| OpenAlex | Busca de trabalhos acadêmicos |
| Crossref | Metadados de publicações científicas |

## Executando localmente

### Requisitos

- Node.js e npm
- Docker e Docker Compose
- Git

Também é possível utilizar uma instalação local do PostgreSQL em vez do Docker.

### Instalação

Clone o repositório:

```bash
git clone https://github.com/SEU_USUARIO/sonora.git
cd sonora
```

Instale as dependências de cada aplicação:

```bash
cd apps/api
npm install

cd ../web
npm install

cd ../..
```

Inicie o banco de dados, caso esteja utilizando Docker Compose:

```bash
docker compose up -d
```

Configure as variáveis de ambiente do backend e execute as migrações do Prisma:

```bash
cd apps/api
npx prisma migrate dev
```

Em seguida, inicie o backend:

```bash
npm run start:dev
```

Em outro terminal, inicie o frontend:

```bash
cd apps/web
npm run dev
```

Por padrão, o frontend do Next.js fica disponível em `http://localhost:3000`. A porta do backend depende da configuração da aplicação.

> **Observação:** os comandos acima pressupõem que os scripts e arquivos de configuração correspondentes já estejam definidos em cada aplicação. Confira o `package.json`, o `docker-compose.yml` e os arquivos de ambiente do projeto caso algum comando não esteja disponível.

## Variáveis de ambiente

Os valores abaixo são exemplos para desenvolvimento local. Ajuste-os de acordo com a configuração do seu banco e da aplicação.

Backend (`apps/api/.env`):

```env
DATABASE_URL="postgresql://sonora:sonora@localhost:5432/sonora"
NODE_ENV=development
PORT=3001
```

Frontend (`apps/web/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Não envie arquivos `.env` com credenciais reais para o GitHub. Use um `.env.example` com valores fictícios para documentar as variáveis necessárias.

## Documentação

A documentação técnica será organizada na pasta `docs/`. Conforme os documentos forem criados, os links poderão ser adicionados aqui.

## Testes

Os comandos de teste dependem dos scripts configurados em cada aplicação. Para consultar os disponíveis:

```bash
cd apps/api
npm run
```

```bash
cd apps/web
npm run
```

## Contribuições

O projeto está aberto a sugestões e contribuições. Antes de enviar uma alteração, vale conferir o estado atual do roadmap e abrir uma issue para discutir mudanças maiores.

Ao contribuir:

- Mantenha o padrão de TypeScript utilizado no projeto.
- Procure seguir a organização existente.
- Inclua testes quando fizer sentido.
- Explique o que foi alterado na descrição do pull request.

## Licença

A licença do projeto ainda precisa ser definida. Quando isso acontecer, o arquivo `LICENSE` e esta seção devem ser atualizados.
