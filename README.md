# fl0w

> A visual AI workflow automation builder — connect triggers, AI models, and services into no-code pipelines.

![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma)
![tRPC](https://img.shields.io/badge/tRPC-398CCB?style=flat&logo=trpc&logoColor=white)

---

## What is fl0w?

fl0w lets you build multi-step AI workflows on a visual canvas. Each workflow is a directed graph of nodes — a trigger kicks things off, and each subsequent node (an AI model call, HTTP request, or messaging action) runs in topological order, passing its output as context into the next.

Workflows can be triggered manually, by an incoming Stripe payment, a Google Forms submission, or a plain HTTP request. Results are tracked per-execution with full status and error reporting.

---

## System architecture

![System Architecture](./system-architecture.png)

> *The diagram above shows how every layer communicates — from the browser through tRPC and Better Auth, down to Prisma/PostgreSQL and the Inngest background job runner, and out to AI providers and external services.*

### How it works end to end

```
Browser
  └─ tRPC (TanStack Query)  ──►  Next.js API Route /api/trpc
                                      └─ Prisma ORM  ──►  PostgreSQL
                                          (workflow CRUD, credentials, executions)

User triggers workflow
  └─ tRPC mutation: workflows.execute
       └─ sendWorkflowExecution()  ──►  Inngest event: "workflows/execute.workflow"
            └─ Inngest function
                 ├─ create Execution record
                 ├─ topological sort of nodes
                 └─ for each node → Executor Registry
                      ├─ OpenAI / Anthropic / Gemini / Azure  (Vercel AI SDK)
                      ├─ HTTP Request
                      ├─ Discord / Slack
                      └─ (result passed as context to next node)

External triggers
  ├─ POST /api/webhooks/stripe     → sendWorkflowExecution()
  └─ POST /api/webhooks/google-form → sendWorkflowExecution()
```

### Key layers

| Layer | Tech | Role |
|---|---|---|
| UI | React 19, XY Flow, Shadcn/UI | Visual workflow canvas and dashboards |
| Data fetching | tRPC v11 + TanStack Query | Type-safe client–server communication |
| Auth | Better Auth | Email/password, GitHub OAuth, Google OAuth |
| Payments | Polar.sh | Pro plan checkout, customer portal |
| Background jobs | Inngest + `@inngest/realtime` | Durable workflow execution, live updates |
| ORM | Prisma 6 + `@prisma/adapter-pg` | Database access with connection pooling |
| Database | PostgreSQL | Workflows, executions, credentials, users |
| AI | Vercel AI SDK | Unified interface for all AI providers |
| Error tracking | Sentry | Edge + server error reporting |

---

## Tech stack

- **Framework** — Next.js 15 (App Router, Turbopack)
- **Language** — TypeScript 5
- **Styling** — Tailwind CSS v4, Shadcn/UI, Radix UI
- **API** — tRPC v11
- **Auth** — Better Auth (email/password · GitHub · Google)
- **Database** — PostgreSQL via Prisma ORM
- **Background jobs** — Inngest (durable functions, real-time channels)
- **AI providers** — OpenAI, Anthropic, Google Gemini, Azure (via Vercel AI SDK)
- **Payments** — Polar.sh
- **Error tracking** — Sentry
- **Linting/formatting** — Biome

---

## Features

- **Visual workflow canvas** — drag-and-drop nodes powered by XY Flow
- **Multi-trigger support** — manual, Stripe, Google Forms, HTTP webhook
- **AI node types** — OpenAI, Anthropic Claude, Google Gemini, Azure OpenAI
- **Action nodes** — HTTP request, Discord message, Slack message
- **Encrypted credentials** — per-user API key vault (AES-encrypted at rest)
- **Execution history** — paginated log of every run with status and error details
- **Pro tier** — Polar.sh checkout gates workflow/credential creation
- **Real-time updates** — Inngest realtime channels stream execution progress

---

## Getting started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- [Inngest CLI](https://www.inngest.com/docs/dev-server) for local background jobs
- [ngrok](https://ngrok.com/) (optional, for testing webhooks locally)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file at the project root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/fl0w"

# Better Auth
BETTER_AUTH_SECRET="your-secret-here"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth providers
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Polar.sh (payments)
POLAR_ACCESS_TOKEN=""
POLAR_SUCCESS_URL="http://localhost:3000/dashboard"

# Inngest
INNGEST_EVENT_KEY=""
INNGEST_SIGNING_KEY=""

# Sentry (optional)
SENTRY_DSN=""
SENTRY_AUTH_TOKEN=""

# Encryption key for stored credentials
ENCRYPTION_KEY=""
```

### 3. Set up the database

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Run the development servers

Run all three processes at once with mprocs:

```bash
npm run dev:all
```

Or start them individually:

```bash
# Next.js
npm run dev

# Inngest dev server (in a separate terminal)
npm run inngest:dev

# ngrok tunnel for webhooks (optional, in a separate terminal)
npm run ngrok:dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project structure

```
src/
├── app/
│   ├── (auth)/              # Login and signup pages
│   ├── (dashboard)/
│   │   ├── (editor)/        # Workflow canvas editor
│   │   └── (rest)/          # Executions, credentials pages
│   └── api/
│       ├── trpc/[trpc]/     # tRPC HTTP handler
│       ├── auth/[...all]/   # Better Auth handler
│       ├── inngest/         # Inngest function endpoint
│       └── webhooks/        # Stripe & Google Forms webhooks
│
├── features/
│   ├── workflows/           # Workflow CRUD (tRPC router + UI components)
│   ├── credentials/         # Credential vault (encrypted storage)
│   ├── executions/          # Execution history + per-node executors
│   └── triggers/            # Trigger node executors
│
├── inngest/
│   ├── client.ts            # Inngest client (with realtime middleware)
│   ├── functions.ts         # executeWorkflow durable function
│   ├── channels/            # Per-provider Inngest channels
│   └── utils.ts             # sendWorkflowExecution helper + topological sort
│
├── lib/
│   ├── auth.ts              # Better Auth config
│   ├── db.ts                # Prisma singleton
│   └── polar.ts             # Polar.sh client
│
└── trpc/
    ├── init.ts              # tRPC init (protectedProcedure, premiumProcedure)
    └── routers/_app.ts      # Root router (workflows, credentials, executions)
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js with Turbopack |
| `npm run dev:all` | Start Next.js + Inngest + ngrok together (mprocs) |
| `npm run inngest:dev` | Start the Inngest local dev server |
| `npm run build` | Production build |
| `npm run lint` | Biome lint check |
| `npm run format` | Biome format (write) |

---

## Database schema (overview)

| Model | Key fields |
|---|---|
| `User` | id, email, name — managed by Better Auth |
| `Workflow` | id, name, userId, nodes[], connections[] |
| `Node` | id, workflowId, type (NodeType enum), position, data |
| `Connection` | source, target, sourceHandle, targetHandle |
| `Execution` | id, workflowId, inngestEventId, status, startedAt, error |
| `Credential` | id, userId, name, type (CredentialType enum), value (encrypted) |

---

## License

MIT
