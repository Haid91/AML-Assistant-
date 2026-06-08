import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFile } from 'fs/promises';

import { detectIndicators } from './src/indicators.js';
import { rankTypologies, TYPOLOGIES } from './src/typologies.js';
import { buildDraft } from './src/narrative.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3100;

app.use(express.json({ limit: '1mb' }));
app.use(express.static(join(__dirname, 'public')));

// List the typology library so the UI can show what the tool knows about.
app.get('/api/typologies', (_req, res) => {
  res.json(Object.values(TYPOLOGIES));
});

// Analyse transactions and return detected indicators + ranked typologies.
app.post('/api/analyse', (req, res) => {
  const { transactions, profile } = req.body || {};
  if (!Array.isArray(transactions)) {
    return res.status(400).json({ error: 'Body must include a "transactions" array.' });
  }
  const indicators = detectIndicators(transactions, profile);
  const suggestedTypologies = rankTypologies(indicators.map((i) => i.code));
  res.json({ indicators, suggestedTypologies });
});

// Produce a full structured SMR draft.
app.post('/api/draft', (req, res) => {
  const { transactions, profile, selectedTypologyIds } = req.body || {};
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return res.status(400).json({ error: 'Body must include a non-empty "transactions" array.' });
  }
  const draft = buildDraft({ transactions, profile, selectedTypologyIds });
  res.json(draft);
});

// Convenience: serve the bundled sample dataset.
app.get('/api/sample', async (_req, res) => {
  try {
    const raw = await readFile(join(__dirname, 'sample-data', 'transactions.sample.json'), 'utf8');
    res.type('application/json').send(raw);
  } catch {
    res.status(404).json({ error: 'Sample data not found.' });
  }
});

app.listen(PORT, () => {
  console.log(`Typology-to-SMR assistant running on http://localhost:${PORT}`);
});
