# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Line & Grace** is a modest westernwear e-commerce platform. It is a full-stack monorepo with a React + Vite frontend and an Express.js backend, orchestrated from the root with `concurrently`.

## Development Commands

Run from the repository root:

```bash
npm run dev            # Start both frontend (port 5173) and backend (port 3000) concurrently
npm run dev:frontend   # Frontend only
npm run dev:backend    # Backend only
npm run build          # Production build of the frontend (outputs to frontend/dist/)
```

There is no test suite or linter configured.

## Architecture

### Monorepo Layout

- `frontend/` — React 18 + Vite application
- `backend/` — Express.js API server
- Root `package.json` uses `concurrently` to run both; it does **not** use npm workspaces — each sub-project manages its own `node_modules`.

### Frontend (`frontend/src/`)

- **Entry**: `main.jsx` → `App.jsx` → `components/LineAndGraceWebsite.jsx`
- `LineAndGraceWebsite.jsx` is the single monolithic page component. All product filtering, search state, newsletter UI, and animations live here.
- `components/ui/` exports reusable primitives (`Button`, `Card`, `Badge`, `Input`) via `index.js`, but these are **not currently used** by `LineAndGraceWebsite.jsx`, which defines its own inline versions. Prefer the `ui/` components for any new UI work.
- Styling is pure Tailwind CSS (stone/neutral palette). Animations use Framer Motion.
- The `@` alias resolves to `frontend/src/` (configured in `vite.config.js`).

### Backend (`backend/server.js`)

A single-file Express server with four routes:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/products` | List products; supports `?category=` and `?search=` query params |
| GET | `/products/:id` | Single product by ID |
| POST | `/cart` | Accepts `{ items }`, returns items with calculated total |
| POST | `/subscribe` | Accepts `{ email }`, simulates newsletter signup |

Product data is **hardcoded in memory** — there is no database. The backend uses ES modules (`"type": "module"` in its `package.json`).

### Frontend ↔ Backend Communication

The Vite dev server proxies all `/api/*` requests to `http://localhost:3000`, stripping the `/api` prefix. For example, a frontend fetch to `/api/products` hits `GET /products` on the backend.

In production, a reverse proxy or equivalent must be configured to replicate this behaviour.
