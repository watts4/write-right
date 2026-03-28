# WriteRight — AI Writing Differentiation for K-8 Teachers

**Live app:** https://write-right-app.web.app
**Backend:** https://write-right-backend-9966771510.us-central1.run.app
**Hackathon:** [Notion MCP Challenge](https://dev.to/challenges/notion) — deadline March 29, 2026

WriteRight connects to a teacher's Notion database of student writing samples, reads them via the **Notion MCP server**, analyzes each student against California Common Core State Standards (CCSS) using Claude AI, and returns per-student teaching points plus small-group recommendations — all in under 2 minutes.

---

## How It Works

### The Three-Phase Pipeline

```
Notion DB → [Phase 1: MCP Read] → [Phase 2: Claude Analysis] → UI Results
                                                              ↘
                                              [Phase 3: /api/save → Notion write-back]
```

**Phase 1 — Notion MCP Read**
The backend spawns `@notionhq/notion-mcp-server` (official Notion MCP npm package) as an HTTP subprocess on a random local port. Claude then runs an agentic tool-use loop, calling Notion MCP tools to:
1. Query the database for all student pages
2. Retrieve the block content (writing sample) for each page

All MCP tool calls within each loop iteration are executed in parallel for speed. The loop runs up to 30 iterations and terminates when Claude returns the student data as JSON.

**Phase 2 — Claude Analysis**
Once all student writing is collected, a separate Claude call analyzes each student against grade-level CCSS Writing and Language standards. No tools needed — pure LLM reasoning. Returns structured JSON with per-student teaching points, strengths, standards addressed, and small-group recommendations.

**Phase 3 — Notion Write-back (user-initiated)**
After results appear in the UI, the teacher can click "Save to Notion" to create a new page in their database with the full analysis summary. This is a separate REST API call triggered by the user — it is NOT part of the analysis pipeline (see Troubleshooting for why).

---

## Setup for Teachers

### 1. Create a Notion Integration

1. Go to https://www.notion.so/my-integrations
2. Create a new integration — name it "WriteRight"
3. Give it **Read content** and **Insert content** capabilities
4. Save the integration (you don't need the secret — WriteRight uses OAuth)

### 2. Set Up Your Writing Database

Your Notion database should have one page per student. Each page's body should contain the student's writing sample as plain text blocks. The page title is the student's name.

> **Important:** After creating the database, open it in Notion and share it with your WriteRight integration (click ••• → Connections → add WriteRight).

### 3. Connect in WriteRight

1. Open https://write-right-app.web.app
2. Enter your Notion Database ID (the part of the URL before `?v=`, e.g. `33111e902ec580cd8cfaf753e22b89d8`)
3. Select your grade level (K–8)
4. Click **Connect with Notion** — this redirects to Notion's OAuth screen
5. Authorize WriteRight and select the workspace containing your database
6. You'll be redirected back automatically

### 4. Run the Analysis

Click **Analyze Class Writing**. The analysis typically takes **1–3 minutes** depending on class size. A live elapsed timer appears after 30 seconds so you know it's still running.

When complete, you'll see:
- **Student Cards** — 2–3 teaching points and 1–2 strengths per student, tied to specific CCSS standards
- **Small Groups** — students clustered by shared instructional need with suggested activities

Click **Save to Notion** to write the full analysis back to your Notion database.

---

## Local Development

### Prerequisites
- Node.js 18+
- An Anthropic API key
- A Notion OAuth integration (client ID + secret)

### Backend

```bash
cd backend
npm install
cp .env.example .env  # fill in values
npm run dev
```

**Required env vars:**
```
ANTHROPIC_API_KEY=sk-ant-...
NOTION_OAUTH_CLIENT_ID=...
NOTION_OAUTH_CLIENT_SECRET=secret_...
OAUTH_REDIRECT_URI=http://localhost:3001/oauth/callback
FRONTEND_URL=http://localhost:5173
PORT=3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

**Required env vars (`frontend/.env.development`):**
```
VITE_API_URL=http://localhost:3001
```

### Seed Mock Data

To populate a Notion database with 8 Grade 3 mock students:
```bash
cd backend
NOTION_TOKEN=ntn_... NOTION_DATABASE_ID=<your-db-id> npx ts-node seed.ts
```

The mock students include deliberate skill gaps across personal narrative, opinion, and expository writing to demonstrate meaningful differentiation.

---

## Deployment

### Backend (Cloud Run)

```bash
# Build
GOOGLE_APPLICATION_CREDENTIALS=~/.firebase-keys/personal-sa.json \
  gcloud builds submit ./backend \
  --tag gcr.io/<PROJECT_ID>/write-right-backend \
  --project <PROJECT_ID>

# Deploy
GOOGLE_APPLICATION_CREDENTIALS=~/.firebase-keys/personal-sa.json \
  gcloud run deploy write-right-backend \
  --image gcr.io/<PROJECT_ID>/write-right-backend \
  --platform managed --region us-central1 --allow-unauthenticated \
  --port 3001 --timeout 300 --memory 512Mi \
  --project <PROJECT_ID>
```

**Cloud Run env vars to set:**
- `ANTHROPIC_API_KEY`
- `NOTION_OAUTH_CLIENT_ID`
- `NOTION_OAUTH_CLIENT_SECRET`
- `OAUTH_REDIRECT_URI` (must match your Notion OAuth app settings)
- `FRONTEND_URL`

### Frontend (Firebase Hosting)

```bash
cd frontend
npm run build
firebase deploy --only hosting --project <FIREBASE_PROJECT_ID>
```

---

## Architecture

```
frontend/                  React + TypeScript + Vite + Tailwind CSS
  src/
    App.tsx                Root — OAuth callback handler, screen routing
    api.ts                 Typed fetch wrappers for all backend endpoints
    components/
      SetupForm.tsx        Grade picker, database ID input, OAuth button
      AnalysisView.tsx     Loading UI with step indicator + elapsed timer
      ResultsView.tsx      Student cards, small group panels, Save button
      StudentCard.tsx      Per-student teaching points + strengths display
      SmallGroupPanel.tsx  Small group cards with activity suggestions

backend/
  src/
    index.ts               Express app, CORS, route registration
    routes/
      analyze.ts           POST /api/analyze — MCP read + Claude analysis
      save.ts              POST /api/save — write results to Notion REST API
      oauth.ts             OAuth 2.0 + PKCE flow (/authorize, /callback, /status)
    services/
      claude.ts            Phase 1 (MCP agentic loop) + Phase 2 (analysis)
      notion.ts            Notion REST API write-back
      sessionStore.ts      In-memory session store (24hr TTL)
      standards.ts         CCSS Writing + Language standards K–8
    types.ts               Shared TypeScript interfaces
  seed.ts                  Populates Notion DB with mock student data
```

---

## Troubleshooting

### "Session expired or invalid. Please reconnect with Notion."
OAuth sessions are stored in memory and expire after 24 hours. Click **Edit setup** and re-authorize with Notion.

### Analysis takes more than 3 minutes and fails
The analyze route has a 5-minute (300s) Cloud Run timeout. If your database has many students with long writing samples, Claude may need more iterations to read all content. Try reducing the number of student pages in your database for demos.

### "Could not read student data from Notion via MCP"
This usually means:
- The database isn't shared with your Notion integration (share it via ••• → Connections)
- The database ID is wrong — use the ID from the URL before the `?v=` parameter
- The writing samples are stored in sub-pages or databases inside pages (WriteRight reads top-level blocks only)

### "Save to Notion" fails after analysis succeeds
The save step uses the same OAuth token as the analysis. If you've been on the results screen for a long time (>24hrs), your session may have expired. Re-run the analysis to get a fresh session.

### Analysis runs but returns empty student list
Claude couldn't find writing content in the expected format. Make sure each student's page has actual text blocks in the page body (not just a page title or embedded databases).

---

## The Build: Challenges & Solutions

Building WriteRight for the Notion MCP Challenge involved several non-obvious architectural decisions worth documenting.

### Challenge 1: Hosted MCP vs. npm package

The Notion MCP server exists in two forms:
- **Hosted:** `mcp.notion.com` — requires OAuth tokens, works well with Claude Desktop
- **npm package:** `@notionhq/notion-mcp-server` — runs as a local subprocess, accepts any Notion token

The Anthropic API's `mcp_servers` parameter (for hosted MCP) sends the Notion token as an `Authorization: Bearer` header. The hosted `mcp.notion.com` server only accepts tokens granted via its own OAuth flow — passing a regular Notion OAuth token causes authentication errors.

**Solution:** Spawn `@notionhq/notion-mcp-server` as a local HTTP subprocess in the Cloud Run container. Connect via `StreamableHTTPClientTransport` from `@modelcontextprotocol/sdk`. This is the official Notion MCP npm package and counts as genuine MCP usage.

### Challenge 2: MCP for reads, REST for writes

Initial approach: use MCP for everything, including writing the analysis back to Notion. This caused severe performance issues — Claude used individual MCP tool calls for each block, creating 50+ sequential API calls for a single write operation.

**Solution:** MCP is ideal for reading (agentic, flexible, handles unknown schema). REST API is better for writes (batch operations, predictable structure). Split: MCP for Phase 1 reads, REST API for the `POST /api/save` write-back.

### Challenge 3: Cloud Run response buffering

After separating the Notion write into a "fire-and-forget" background task (so the HTTP response could return immediately), the frontend still appeared to hang. Cloud Run logs showed the response was delayed until all background async work finished — Node.js kept the event loop active, and Cloud Run buffered the response.

**Solution:** Remove ALL side effects from the `/api/analyze` route. It does one thing: MCP read → Claude analysis → return JSON. The Notion write is a separate `/api/save` endpoint triggered explicitly by the user after viewing results.

### Challenge 4: Sequential vs. parallel MCP tool calls

Each iteration of the Claude agentic loop ends with the model returning one or more `tool_use` blocks. The initial implementation awaited these sequentially in a `for...of` loop. When Claude batched 8 page-retrieve calls in a single response, they ran one after another.

**Solution:** `Promise.all` across the tool calls within each iteration. All tool calls in a single Claude response now run concurrently, cutting Phase 1 time from 4+ minutes to under 2 minutes in most cases.

### Challenge 5: Notion database ID vs. view ID

The Notion URL for a database looks like:
```
https://www.notion.so/My-Database-33111e902ec580cd8cfaf753e22b89d8?v=abc123...
```
The database ID is `33111e902ec580cd8cfaf753e22b89d8` (before the `?`). The `?v=` parameter is the view ID, not the database ID. Using the view ID returns `object_not_found` errors from both the REST API and MCP server.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| AI | Anthropic Claude (claude-sonnet-4-6) |
| MCP | @notionhq/notion-mcp-server, @modelcontextprotocol/sdk |
| Auth | Notion OAuth 2.0 + PKCE |
| Hosting | Firebase Hosting (frontend), Google Cloud Run (backend) |
| Standards | California CCSS Writing + Language Standards K–8 |
