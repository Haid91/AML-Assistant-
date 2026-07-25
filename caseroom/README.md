# Caseroom

An AI-generated AML/AUSTRAC investigation training simulator. Every case is
generated fresh: a customer profile and transaction ledger, an alert reason,
and a hidden ground truth (suspicious or a false positive). The trainee
questions in-character sources, picks a disposition (no further action,
continue monitoring, or file an SMR), drafts the suspicion narrative where
required, and gets QA-graded against AUSTRAC expectations.

> ⚠️ Fictional training scenarios only. Not legal or compliance advice.

## Architecture

- `frontend/` — React + Vite single-page app (the case UI, all state client-side).
- `backend/` — Express server that proxies chat calls to the Anthropic API.
  The frontend never talks to Anthropic directly: the API key stays on the
  server, and the server pins the model, so nothing sensitive or
  attacker-controlled reaches the upstream call from the browser.

## Run it

```bash
cd caseroom
cp .env.example .env   # then set ANTHROPIC_API_KEY
npm run dev
```

This starts the backend on `http://localhost:3101` and the frontend dev
server on `http://localhost:5174` (which proxies `/api` to the backend).

Or run each side individually:

```bash
cd backend && npm install && npm start   # http://localhost:3101
cd frontend && npm install && npm run dev   # http://localhost:5174
```

### Production build

```bash
npm run build     # builds frontend/dist
npm start         # backend serves frontend/dist if present
```

## API

| Method | Endpoint      | Purpose                                                        |
| ------ | ------------- | ---------------------------------------------------------------- |
| POST   | `/api/claude` | `{ messages, max_tokens }` → proxies to the Anthropic Messages API |
| GET    | `/api/health` | Liveness check; reports whether `ANTHROPIC_API_KEY` is configured |

## Environment variables

| Variable            | Required | Description                          |
| -------------------- | -------- | ------------------------------------- |
| `ANTHROPIC_API_KEY`  | yes      | Server-side key used to call Claude.  |
| `PORT`               | no       | Backend port (default `3101`).        |
