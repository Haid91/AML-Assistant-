# Typology → SMR Drafting Assistant (prototype)

Takes raw transaction patterns and drafts a **Suspicious Matter Report (SMR)**
narrative framed around AUSTRAC expectations. Rather than being a generic LLM
wrapper, it is built around the *structure of a good SMR*: a deterministic
indicator-detection engine surfaces red flags, maps them to recognised
money-laundering typologies, and assembles a draft narrative with the sections
financial intelligence actually needs.

> ⚠️ **Prototype / drafting aid only.** Output is a structured starting point.
> Every figure, identifier and conclusion must be reviewed and verified by a
> qualified analyst before any reporting decision or lodgement with AUSTRAC.

## What it does

1. **Detect indicators** — pattern detectors over the transaction set, each
   returning its supporting evidence (`src/indicators.js`):
   - Cash deposits just below the AUD 10,000 TTR threshold
   - Cash aggregating over threshold within a short window
   - Cash spread across multiple channels/locations
   - Rapid in-and-out (pass-through / flow-through) movement
   - Negligible retained balance
   - Predominance of round-figure amounts
   - Third-party cash deposits
   - Higher-risk jurisdiction exposure
   - Many international beneficiaries / many funding sources
   - Activity inconsistent with the customer profile
   - High transaction velocity
2. **Map to typologies** — ranks AUSTRAC-aligned typologies (structuring,
   rapid movement, cuckoo smurfing, international funnelling, unexplained
   wealth, money mule) by how strongly the fired indicators support each one
   (`src/typologies.js`).
3. **Draft the narrative** — assembles a structured SMR with the sections a
   good report needs: grounds for suspicion, subject (Who), the activity
   (What/When/Where/How), indicators, typology assessment (Why), and a
   recommendation — plus an AUSTRAC-style quality checklist
   (`src/narrative.js`).

## Run it

```bash
cd smr-assistant
npm install
npm start          # http://localhost:3100  (set PORT to override)
```

Open the URL, click **Load sample data**, then **Generate SMR draft**.

## API

| Method | Endpoint          | Purpose                                            |
| ------ | ----------------- | -------------------------------------------------- |
| GET    | `/api/typologies` | The typology library.                              |
| POST   | `/api/analyse`    | `{ transactions, profile }` → indicators + ranking |
| POST   | `/api/draft`      | `{ transactions, profile, selectedTypologyIds? }` → full draft |
| GET    | `/api/sample`     | The bundled sample dataset.                        |

### Transaction shape

```json
{
  "date": "2026-04-02",
  "amount": 9400,
  "direction": "credit",            // or "debit"
  "method": "cash",                  // transfer | international_transfer | card | cheque | crypto
  "counterparty": "L. Nguyen",
  "counterpartyCountry": "AU",       // ISO-3166 alpha-2
  "channel": "branch",               // atm | online | app
  "description": "Cash deposit"
}
```

### Profile shape (optional, all fields optional)

```json
{
  "name": "Jordan Avery",
  "accountId": "AC-4471902",
  "occupation": "Part-time hospitality worker",
  "statedAnnualIncome": 38000,
  "expectedMonthlyTurnover": 4000,
  "riskRating": "Medium"
}
```

## Test

```bash
npm test           # node --test
```

## Scope & limitations

- Detection thresholds (e.g. the AUD 10,000 TTR trigger, the high-risk
  jurisdiction list) are illustrative defaults for the prototype. In production
  they would be driven by the reporting entity's own AML/CTF program and risk
  methodology.
- The narrative is template-driven and deterministic — there is no external
  model call, so no transaction data leaves the host. A future iteration could
  add an optional LLM pass to refine prose, with the structured engine output
  as its grounding.
- AUSTRAC references are descriptive pointers to public guidance, not legal
  advice.
