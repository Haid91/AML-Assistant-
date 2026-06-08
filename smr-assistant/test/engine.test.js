import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { detectIndicators } from '../src/indicators.js';
import { rankTypologies } from '../src/typologies.js';
import { buildDraft } from '../src/narrative.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function loadSample() {
  const raw = await readFile(join(__dirname, '..', 'sample-data', 'transactions.sample.json'), 'utf8');
  return JSON.parse(raw);
}

test('detects structuring on near-threshold cash deposits', async () => {
  const { transactions, profile } = await loadSample();
  const indicators = detectIndicators(transactions, profile);
  const codes = indicators.map((i) => i.code);
  assert.ok(codes.includes('CASH_NEAR_THRESHOLD'), 'should flag near-threshold cash');
});

test('detects high-risk jurisdiction exposure', async () => {
  const { transactions } = await loadSample();
  const codes = detectIndicators(transactions, null).map((i) => i.code);
  assert.ok(codes.includes('HIGH_RISK_JURISDICTION'));
});

test('flags activity inconsistent with profile', async () => {
  const { transactions, profile } = await loadSample();
  const codes = detectIndicators(transactions, profile).map((i) => i.code);
  assert.ok(codes.includes('INCONSISTENT_PROFILE'));
});

test('ranks structuring among the top typologies for the sample', async () => {
  const { transactions, profile } = await loadSample();
  const indicators = detectIndicators(transactions, profile);
  const ranked = rankTypologies(indicators.map((i) => i.code));
  assert.ok(ranked.length > 0);
  const ids = ranked.map((t) => t.id);
  assert.ok(ids.includes('STRUCTURING') || ids.includes('CUCKOO_SMURFING'));
});

test('buildDraft produces all required SMR sections', async () => {
  const { transactions, profile } = await loadSample();
  const draft = buildDraft({ transactions, profile });
  const headings = draft.sections.map((s) => s.heading);
  assert.equal(headings.length, 6);
  assert.match(draft.narrative, /Grounds for suspicion/);
  assert.match(draft.narrative, /Typology assessment/);
  assert.ok(draft.disclaimer.includes('PROTOTYPE'));
  assert.ok(Array.isArray(draft.qualityChecks) && draft.qualityChecks.length === 4);
});

test('empty input yields no indicators and a safe draft', () => {
  const draft = buildDraft({ transactions: [], profile: null });
  assert.equal(draft.indicators.length, 0);
  assert.equal(draft.suggestedTypologies.length, 0);
  assert.match(draft.narrative, /grounds for suspicion to be articulated/i);
});
