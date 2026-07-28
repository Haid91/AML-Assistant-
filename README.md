# AML Assistant

A collection of AML/CTF (anti-money laundering / counter-terrorism financing)
tools built around AUSTRAC reporting practice, plus an unrelated e-commerce
prototype that predates the rename.

> ⚠️ Prototypes and training material only. Not legal or compliance advice.

## Projects

### `caseroom/` — AML case simulator

An AI-generated investigation training simulator. Each case is generated fresh
with a customer profile, transaction ledger, an alert reason, and a hidden
ground truth (genuinely suspicious, or a false positive). The trainee questions
in-character sources, picks a disposition (no further action, continue
monitoring, or file an SMR), drafts the suspicion narrative where required, and
is QA-graded against AUSTRAC expectations.

React + Vite frontend, Express backend that proxies model calls so the API key
stays server-side. See [`caseroom/README.md`](caseroom/README.md).

### `smr-assistant/` — typology → SMR drafting assistant

Takes raw transaction patterns and drafts a Suspicious Matter Report narrative.
A deterministic indicator-detection engine surfaces red flags, maps them to
recognised money-laundering typologies, and assembles a structured draft — no
external model call, so no transaction data leaves the host. See
[`smr-assistant/README.md`](smr-assistant/README.md).

### `frontend/` + `backend/` — Line & Grace

An earlier, unrelated e-commerce prototype (React + Vite storefront with an
Express API). Kept for history; not part of the AML tooling.

## Getting started

Each project is self-contained and installs its own dependencies:

```bash
cd caseroom && npm run dev        # AML case simulator
cd smr-assistant && npm start     # SMR drafting assistant
npm run dev                       # Line & Grace (from the repo root)
```
